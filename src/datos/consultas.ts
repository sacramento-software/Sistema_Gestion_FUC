// Única puerta de entrada de las vistas a los datos (sección 10 de la spec 3). Cada consulta lee «hoy» al
// ejecutarse (nunca al importar el módulo), resuelve fechas, nombres y estados, y devuelve objetos listos
// para pintar. Todas son síncronas.
import { avisosParaEvento, nombreBote, nombreCortoBote, type AvisoInscripcion } from '@/dominio/botes';
import { NOMBRE_CAMPEONATO, tablaClubes, tablaDeportistas, type FinalParaTabla } from '@/dominio/campeonatos';
import { CATEGORIAS, categoriaEnTemporada, nombreCategoria } from '@/dominio/categorias';
import {
  categoriaGenero,
  codigoEvento,
  etiquetaEmbarcacion,
  filtroCategoria,
  lecturaEvento,
  textoGenero,
} from '@/dominio/eventos';
import { estadoFicha, TEXTO_FICHA } from '@/dominio/ficha-medica';
import {
  diasEntre,
  fechaRelativa,
  formatearFecha,
  formatearHora,
  formatearRango,
  hoyISO,
  textoCierre,
} from '@/dominio/fechas';
import { calcularResultados, TABLA_PUNTOS, textoAvance, type FilaCalculada } from '@/dominio/resultados';
import { formatearDiferencia, formatearTiempo, leyendaCodigos } from '@/dominio/tiempos';
import { catalogo } from './catalogo';
import { clubes } from './clubes';
import { competencias, eventos, fases, series } from './competencias';
import { deportistas } from './deportistas';
import { elegiblesParaFase, fasesDeEvento, seriesDeFase } from './flujo';
import { inscripciones } from './inscripciones';
import { noticias } from './noticias';
import { delegados, equipoFederacion } from './personas';
import { sinTildes } from './texto';
import type {
  Competencia,
  Deportista,
  Embarcacion,
  Evento,
  EventoCatalogo,
  Fase,
  FechaISO,
  Inscripcion,
  MiembroEquipo,
  Serie,
  TipoCampeonato,
} from './tipos';
import type {
  ArmadoDeFase,
  BoteVista,
  CampeonatoVista,
  CatalogoVista,
  ClubVista,
  CompetenciaVista,
  ConfiguracionFederacion,
  DeportistaVista,
  DiaPrograma,
  EventoVista,
  FaseVista,
  FichaDeportista,
  FilaCampeonato,
  FilaResultado,
  ItemPrograma,
  NoticiaVista,
  SerieDetalle,
  SerieResumen,
} from './vistas';

// --- Índices (solo datos fijos: nada que dependa de la fecha) -----------------------------------------------

const clubPorId = new Map(clubes.map((c) => [c.id, c]));
const deportistaPorId = new Map(deportistas.map((d) => [d.id, d]));
const catalogoPorId = new Map(catalogo.map((c) => [c.id, c]));
const competenciaPorId = new Map(competencias.map((c) => [c.id, c]));
const eventoPorId = new Map(eventos.map((e) => [e.id, e]));
const fasePorId = new Map(fases.map((f) => [f.id, f]));
const seriePorId = new Map(series.map((s) => [s.id, s]));
const inscripcionPorId = new Map(inscripciones.map((i) => [i.id, i]));

function obtener<T>(mapa: Map<string, T>, id: string, que: string): T {
  const valor = mapa.get(id);
  if (valor === undefined) throw new Error(`${que} inexistente: ${id}`);
  return valor;
}

const ORDEN_EMBARCACION: Embarcacion[] = ['K1', 'K2', 'K4', 'C1', 'C2'];
const ORDEN_TIPOS: TipoCampeonato[] = ['velocidad', 'medio-fondo', 'short-race', 'promocional'];
const ORDEN_GENERO = ['F', 'M', 'X'];

const porDiaYHora = (a: { dia: number; hora: string }, b: { dia: number; hora: string }) =>
  a.dia - b.dia || a.hora.localeCompare(b.hora);

// --- Bloques comunes ----------------------------------------------------------------------------------------

function textoCategoriaDe(deportista: Deportista, hoy: FechaISO): string {
  const categoria = categoriaEnTemporada(deportista, hoy);
  return categoria ? nombreCategoria(categoria) : '';
}

function boteVista(inscripcion: Inscripcion, hoy: FechaISO): BoteVista {
  const club = obtener(clubPorId, inscripcion.clubId, 'Club');
  const evento = obtener(eventoPorId, inscripcion.eventoId, 'Evento');
  const tipo = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
  const integrantes = inscripcion.deportistaIds.map((id) => obtener(deportistaPorId, id, 'Deportista'));
  return {
    inscripcionId: inscripcion.id,
    numero: inscripcion.numero,
    clubId: club.id,
    clubNombre: club.nombre,
    clubSigla: club.sigla,
    deportistas: integrantes.map((d) => ({
      id: d.id,
      nombreCompleto: `${d.nombre} ${d.apellido}`,
      categoriaTexto: textoCategoriaDe(d, hoy),
      sexo: d.sexo,
      ficha: estadoFicha(d.fichaMedica),
    })),
    nombre: nombreBote(integrantes),
    nombreCorto: nombreCortoBote(integrantes),
    embarcacion: tipo.embarcacion,
  };
}

const porClubYNumero = (a: BoteVista, b: BoteVista) =>
  a.clubNombre.localeCompare(b.clubNombre, 'es') || a.numero - b.numero;

function eventosDe(competenciaId: string): Evento[] {
  const primera = (evento: Evento) => {
    const f = fasesDeEvento(evento.id)[0];
    return f ? { dia: f.dia, hora: f.hora } : { dia: 0, hora: '00:00' };
  };
  return eventos
    .filter((e) => e.competenciaId === competenciaId)
    .sort((a, b) => porDiaYHora(primera(a), primera(b)));
}

function seriesDeEvento(eventoId: string): Serie[] {
  const ids = new Set(fasesDeEvento(eventoId).map((f) => f.id));
  return series.filter((s) => ids.has(s.faseId));
}

function estadoDeEvento(eventoId: string): EventoVista['estado'] {
  if (seriesDeEvento(eventoId).some((s) => s.estado === 'en-vivo')) return 'en-vivo';
  const delEvento = fasesDeEvento(eventoId);
  const todasConSeries = delEvento.every((f) => seriesDeFase(f.id).length > 0);
  const ultima = delEvento[delEvento.length - 1];
  if (todasConSeries && ultima.tipo === 'final' && seriesDeFase(ultima.id).every((s) => s.estado === 'publicada')) {
    return 'finalizado';
  }
  return 'programado';
}

function eventoBase(evento: Evento): Omit<EventoVista, 'fases'> {
  const tipo = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
  const suyas = inscripciones.filter((i) => i.eventoId === evento.id);
  return {
    id: evento.id,
    competenciaId: evento.competenciaId,
    codigo: codigoEvento(tipo),
    lectura: lecturaEvento(tipo),
    embarcacion: tipo.embarcacion,
    distancia: tipo.distancia,
    categoriaId: tipo.categoriaId,
    categoriaTexto: nombreCategoria(tipo.categoriaId),
    genero: tipo.genero,
    generoTexto: textoGenero(tipo.genero),
    categoriaGenero: categoriaGenero(tipo),
    filtroCategoria: filtroCategoria(tipo),
    botesInscriptos: suyas.length,
    clubesInscriptos: new Set(suyas.map((i) => i.clubId)).size,
    estado: estadoDeEvento(evento.id),
  };
}

function serieResumen(serie: Serie, hoy: FechaISO): SerieResumen {
  const fase = obtener(fasePorId, serie.faseId, 'Fase');
  const evento = obtener(eventoPorId, fase.eventoId, 'Evento');
  const tipo = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
  return {
    id: serie.id,
    competenciaId: evento.competenciaId,
    eventoId: evento.id,
    faseId: fase.id,
    nombre: serie.nombre,
    titulo: `${serie.nombre} · ${etiquetaEmbarcacion(tipo)}`,
    categoriaGenero: categoriaGenero(tipo),
    fecha: fechaRelativa(serie.dia, hoy),
    hora: serie.hora,
    horaTexto: formatearHora(serie.hora),
    estado: serie.estado,
    esFinal: fase.tipo === 'final',
    cantidadCarriles: serie.carriles.length,
  };
}

function faseVista(fase: Fase, hoy: FechaISO): FaseVista {
  const suyas = seriesDeFase(fase.id).sort(porDiaYHora);
  return {
    id: fase.id,
    tipo: fase.tipo,
    nombre: fase.nombre,
    fecha: fechaRelativa(fase.dia, hoy),
    hora: fase.hora,
    horaTexto: formatearHora(fase.hora),
    ...(fase.avance ? { avanceTexto: textoAvance(fase.avance) } : {}),
    prevista: suyas.length === 0,
    series: suyas.map((s) => serieResumen(s, hoy)),
  };
}

function eventoVista(evento: Evento, hoy: FechaISO): EventoVista {
  return { ...eventoBase(evento), fases: fasesDeEvento(evento.id).map((f) => faseVista(f, hoy)) };
}

function filasCalculadas(serie: Serie, fase: Fase): FilaCalculada[] {
  return calcularResultados(serie.carriles, { tipoFase: fase.tipo, avance: fase.avance });
}

function filaResultado(fila: FilaCalculada, hoy: FechaISO): FilaResultado {
  const inscripcion = obtener(inscripcionPorId, fila.inscripcionId, 'Inscripción');
  return {
    posicion: fila.posicion,
    carril: fila.numero,
    bote: boteVista(inscripcion, hoy),
    tiempo: fila.tiempoCs === null ? null : formatearTiempo(fila.tiempoCs),
    diferencia: fila.diferenciaCs === null ? null : formatearDiferencia(fila.diferenciaCs),
    ...(fila.codigo ? { codigo: fila.codigo, motivo: fila.motivo, ...(fila.detalle ? { detalle: fila.detalle } : {}) } : {}),
    puntos: fila.puntos,
    medalla: fila.medalla,
    clasificado: fila.clasificado,
  };
}

function serieDetalle(serie: Serie, hoy: FechaISO): SerieDetalle {
  const fase = obtener(fasePorId, serie.faseId, 'Fase');
  const evento = obtener(eventoPorId, fase.eventoId, 'Evento');
  const competencia = obtener(competenciaPorId, evento.competenciaId, 'Competencia');
  const delEvento = fasesDeEvento(evento.id);
  const conResultados = serie.estado === 'terminada' || serie.estado === 'publicada';
  const filas = conResultados ? filasCalculadas(serie, fase) : null;
  const codigos = filas ? filas.flatMap((f) => (f.codigo ? [f.codigo] : [])) : [];
  const leyendaCodigo = leyendaCodigos(codigos);

  return {
    ...serieResumen(serie, hoy),
    competencia: competenciaVista(competencia, hoy),
    evento: eventoBase(evento),
    fase: {
      tipo: fase.tipo,
      nombre: fase.nombre,
      ...(fase.avance ? { avanceTexto: textoAvance(fase.avance), avanceDestino: fase.avance.destino } : {}),
    },
    fasesDelEvento: delEvento.map((f) => f.nombre),
    indiceFase: delEvento.findIndex((f) => f.id === fase.id),
    ...(serie.largada ? { largada: serie.largada } : {}),
    ...(serie.publicada ? { publicada: serie.publicada } : {}),
    carriles: [...serie.carriles]
      .sort((a, b) => a.numero - b.numero)
      .map((carril) => {
        const resultado = carril.resultado;
        return {
          numero: carril.numero,
          bote: boteVista(obtener(inscripcionPorId, carril.inscripcionId, 'Inscripción'), hoy),
          ...(resultado && 'tiempoCs' in resultado ? { tiempo: formatearTiempo(resultado.tiempoCs) } : {}),
          ...(resultado && 'codigo' in resultado
            ? {
                codigo: resultado.codigo,
                motivo: resultado.motivo,
                ...(resultado.detalle ? { detalle: resultado.detalle } : {}),
              }
            : {}),
        };
      }),
    tiemposCargados: serie.carriles.filter((c) => c.resultado && 'tiempoCs' in c.resultado).length,
    resultados: filas ? filas.map((f) => filaResultado(f, hoy)) : null,
    leyenda: filas
      ? `${leyendaCodigo ? `${leyendaCodigo}. ` : ''}Diferencias respecto del primero.`
      : null,
  };
}

function competenciaVista(competencia: Competencia, hoy: FechaISO): CompetenciaVista {
  const fechaInicio = fechaRelativa(competencia.diaInicio, hoy);
  const fechaFin = fechaRelativa(competencia.diaFin, hoy);
  const suyos = eventos.filter((e) => e.competenciaId === competencia.id);
  const idsEventos = new Set(suyos.map((e) => e.id));
  const suyas = inscripciones.filter((i) => idsEventos.has(i.eventoId));
  const embarcaciones = new Set(suyos.map((e) => obtener(catalogoPorId, e.catalogoId, 'Evento de catálogo').embarcacion));
  const cierreFecha = competencia.cierreInscripcion
    ? fechaRelativa(competencia.cierreInscripcion.dia, hoy)
    : undefined;
  return {
    id: competencia.id,
    nombre: competencia.nombre,
    sede: competencia.sede,
    tipo: competencia.tipo,
    tipoTexto: NOMBRE_CAMPEONATO[competencia.tipo],
    estado: competencia.estado,
    fechaInicio,
    fechaFin,
    fechas: {
      larga: formatearRango(fechaInicio, fechaFin, 'larga'),
      media: formatearRango(fechaInicio, fechaFin, 'media'),
      corta: formatearRango(fechaInicio, fechaFin, 'corta'),
    },
    ...(competencia.cierreInscripcion && cierreFecha
      ? {
          cierre: {
            fecha: cierreFecha,
            hora: competencia.cierreInscripcion.hora,
            texto: textoCierre(cierreFecha, competencia.cierreInscripcion.hora, hoy),
            diasRestantes: diasEntre(hoy, cierreFecha),
          },
        }
      : {}),
    resumen: competencia.resumen,
    embarcaciones: ORDEN_EMBARCACION.filter((e) => embarcaciones.has(e)),
    cantidadEventos: suyos.length,
    botesInscriptos: suyas.length,
    clubesInscriptos: new Set(suyas.map((i) => i.clubId)).size,
  };
}

function deportistaVista(deportista: Deportista, hoy: FechaISO): DeportistaVista {
  const club = obtener(clubPorId, deportista.clubId, 'Club');
  const categoriaId = categoriaEnTemporada(deportista, hoy);
  const ficha = estadoFicha(deportista.fichaMedica);
  return {
    id: deportista.id,
    nombreCompleto: `${deportista.nombre} ${deportista.apellido}`,
    nombre: deportista.nombre,
    apellido: deportista.apellido,
    sexo: deportista.sexo,
    sexoTexto: deportista.sexo === 'F' ? 'Femenino' : 'Masculino',
    edad: deportista.edad,
    clubId: club.id,
    clubNombre: club.nombre,
    categoriaId: categoriaId ?? 'PRE_INFANTIL',
    categoriaTexto: categoriaId ? nombreCategoria(categoriaId) : '',
    ficha,
    fichaTexto: TEXTO_FICHA[ficha],
    ...('venceEnDias' in deportista.fichaMedica
      ? { fichaVence: fechaRelativa(deportista.fichaMedica.venceEnDias, hoy) }
      : {}),
  };
}

// --- Competencias ---------------------------------------------------------------------------------------------

export function listarCompetencias(): CompetenciaVista[] {
  const hoy = hoyISO();
  return [...competencias].sort((a, b) => a.diaInicio - b.diaInicio).map((c) => competenciaVista(c, hoy));
}

export function obtenerCompetencia(id: string): CompetenciaVista | null {
  const competencia = competenciaPorId.get(id);
  return competencia ? competenciaVista(competencia, hoyISO()) : null;
}

export function competenciaEnCurso(): CompetenciaVista | null {
  return listarCompetencias().find((c) => c.estado === 'curso') ?? null;
}

export function competenciasAbiertas(): CompetenciaVista[] {
  return listarCompetencias().filter((c) => c.estado === 'abiertas');
}

export function eventosDeCompetencia(competenciaId: string): EventoVista[] {
  const hoy = hoyISO();
  return eventosDe(competenciaId).map((e) => eventoVista(e, hoy));
}

export function obtenerEvento(eventoId: string): EventoVista | null {
  const evento = eventoPorId.get(eventoId);
  return evento ? eventoVista(evento, hoyISO()) : null;
}

export function programaDeCompetencia(competenciaId: string): DiaPrograma[] {
  const hoy = hoyISO();
  const items: ItemPrograma[] = [];
  for (const evento of eventosDe(competenciaId)) {
    const base = eventoBase(evento);
    for (const fase of fasesDeEvento(evento.id)) {
      const suyas = seriesDeFase(fase.id);
      if (suyas.length === 0) {
        const fecha = fechaRelativa(fase.dia, hoy);
        items.push({
          fecha,
          hora: fase.hora,
          horaTexto: formatearHora(fase.hora),
          eventoId: evento.id,
          eventoLectura: base.lectura,
          filtroCategoria: base.filtroCategoria,
          fase: fase.nombre,
          titulo: `${fase.nombre} · ${etiquetaEmbarcacion(base)}`,
          categoriaGenero: base.categoriaGenero,
          estado: 'prevista',
        });
        continue;
      }
      for (const serie of suyas) {
        const resumen = serieResumen(serie, hoy);
        items.push({
          fecha: resumen.fecha,
          hora: resumen.hora,
          horaTexto: resumen.horaTexto,
          eventoId: evento.id,
          eventoLectura: base.lectura,
          filtroCategoria: base.filtroCategoria,
          fase: fase.nombre,
          titulo: resumen.titulo,
          categoriaGenero: resumen.categoriaGenero,
          estado: serie.estado,
          serieId: serie.id,
        });
      }
    }
  }
  const fechas = [...new Set(items.map((i) => i.fecha))].sort();
  return fechas.map((fecha) => ({
    fecha,
    titulo: formatearFecha(fecha, 'dia'),
    tituloCorto: formatearFecha(fecha, 'dia-corto'),
    items: items
      .filter((i) => i.fecha === fecha)
      .sort((a, b) => a.hora.localeCompare(b.hora) || a.titulo.localeCompare(b.titulo, 'es')),
  }));
}

// --- Series y resultados --------------------------------------------------------------------------------------

export function obtenerSerie(serieId: string): SerieDetalle | null {
  const serie = seriePorId.get(serieId);
  return serie ? serieDetalle(serie, hoyISO()) : null;
}

export function serieEnVivo(): SerieDetalle | null {
  const serie = series.filter((s) => s.estado === 'en-vivo').sort(porDiaYHora)[0];
  return serie ? serieDetalle(serie, hoyISO()) : null;
}

function seriesDeCompetencia(competenciaId: string): Serie[] {
  const ids = new Set(eventos.filter((e) => e.competenciaId === competenciaId).map((e) => e.id));
  return series.filter((s) => ids.has(obtener(fasePorId, s.faseId, 'Fase').eventoId));
}

export function jornadaDeHoy(): SerieResumen[] {
  const hoy = hoyISO();
  const enCurso = competencias.find((c) => c.estado === 'curso');
  if (!enCurso) return [];
  return seriesDeCompetencia(enCurso.id)
    .filter((s) => s.dia === 0)
    .sort(porDiaYHora)
    .map((s) => serieResumen(s, hoy));
}

function esFinalPublicada(serie: Serie): boolean {
  return serie.estado === 'publicada' && obtener(fasePorId, serie.faseId, 'Fase').tipo === 'final';
}

export function ultimasFinalesPublicadas(n: number): SerieDetalle[] {
  const hoy = hoyISO();
  return series
    .filter(esFinalPublicada)
    .sort((a, b) => b.dia - a.dia || (b.publicada ?? '').localeCompare(a.publicada ?? ''))
    .slice(0, n)
    .map((s) => serieDetalle(s, hoy));
}

export function seriesPublicadas(competenciaId: string): SerieDetalle[] {
  const hoy = hoyISO();
  return seriesDeCompetencia(competenciaId)
    .filter((s) => s.estado === 'publicada')
    .sort(porDiaYHora)
    .map((s) => serieDetalle(s, hoy));
}

// --- Armado de fase -------------------------------------------------------------------------------------------

/** Cuántos botes se espera que corran la fase: los clasificados si ya se conocen, o lo que arman las fases previas. */
function cuposDeFase(fase: Fase, elegibles: Set<string> | null, totalInscriptos: number): number {
  if (elegibles) return elegibles.size;
  const delEvento = fasesDeEvento(fase.eventoId);
  const cupos = (f: Fase | undefined) =>
    f && f.avance ? seriesDeFase(f.id).length * f.avance.cantidad : 0;
  const de = (tipo: Fase['tipo']) => delEvento.find((f) => f.tipo === tipo);
  if (fase.tipo === 'semifinal') return cupos(de('eliminatoria')) + cupos(de('repechaje')) || totalInscriptos;
  if (fase.tipo === 'final') {
    const semifinal = de('semifinal');
    return (semifinal ? cupos(semifinal) : cupos(de('eliminatoria')) + cupos(de('repechaje'))) || totalInscriptos;
  }
  return totalInscriptos;
}

export function armadoDeFase(faseId: string): ArmadoDeFase | null {
  const fase = fasePorId.get(faseId);
  if (!fase) return null;
  const hoy = hoyISO();
  const evento = obtener(eventoPorId, fase.eventoId, 'Evento');
  const delEvento = fasesDeEvento(evento.id);
  const esPrimera = delEvento[0].id === fase.id;
  const suyas = inscripciones.filter((i) => i.eventoId === evento.id);
  const detalles = seriesDeFase(fase.id).sort(porDiaYHora).map((s) => serieDetalle(s, hoy));
  const ubicacion = new Map<string, { serieId: string; carril: number }>();
  for (const serie of detalles) {
    for (const carril of serie.carriles) {
      ubicacion.set(carril.bote.inscripcionId, { serieId: serie.id, carril: carril.numero });
    }
  }
  const elegibles = elegiblesParaFase(fase);
  const botesElegibles = suyas.filter((i) => (elegibles ? elegibles.has(i.id) : esPrimera));

  const sinCarril = botesElegibles.filter((i) => !ubicacion.has(i.id)).map((i) => boteVista(i, hoy));
  const disponibles = [...new Set(sinCarril.map((b) => b.clubId))]
    .map((clubId) => {
      const delClub = sinCarril.filter((b) => b.clubId === clubId).sort((a, b) => a.numero - b.numero);
      return { clubId, clubNombre: delClub[0].clubNombre, botes: delClub };
    })
    .sort((a, b) => a.clubNombre.localeCompare(b.clubNombre, 'es'));

  const inscriptos = esPrimera
    ? []
    : suyas
        .map((i) => boteVista(i, hoy))
        .sort(porClubYNumero)
        .map((bote) => {
          const lugar = ubicacion.get(bote.inscripcionId);
          return {
            bote,
            clasificado: elegibles ? elegibles.has(bote.inscripcionId) : false,
            ...(lugar ? { serieId: lugar.serieId, carril: lugar.carril } : {}),
          };
        });

  return {
    evento: eventoBase(evento),
    fase: faseVista(fase, hoy),
    fasesDelEvento: delEvento.map((f) => faseVista(f, hoy)),
    series: detalles,
    disponibles,
    inscriptos,
    botesConCarril: ubicacion.size,
    botesTotales: esPrimera ? suyas.length : cuposDeFase(fase, elegibles, suyas.length),
  };
}

// --- Deportistas ----------------------------------------------------------------------------------------------

export function listarDeportistas(filtro?: {
  texto?: string;
  clubId?: string;
  categoriaId?: string;
  sexo?: string;
}): DeportistaVista[] {
  const hoy = hoyISO();
  const buscado = filtro?.texto ? sinTildes(filtro.texto.trim()) : '';
  return deportistas
    .map((d) => deportistaVista(d, hoy))
    .filter((d) => {
      if (filtro?.clubId && d.clubId !== filtro.clubId) return false;
      if (filtro?.categoriaId && d.categoriaId !== filtro.categoriaId) return false;
      if (filtro?.sexo && d.sexo !== filtro.sexo) return false;
      if (buscado) {
        const club = obtener(clubPorId, d.clubId, 'Club');
        const pajar = sinTildes(`${d.nombre} ${d.apellido} ${club.nombre} ${club.sigla}`);
        if (!pajar.includes(buscado)) return false;
      }
      return true;
    })
    .sort((a, b) => a.apellido.localeCompare(b.apellido, 'es') || a.nombre.localeCompare(b.nombre, 'es'));
}

export function obtenerDeportista(id: string): DeportistaVista | null {
  const deportista = deportistaPorId.get(id);
  return deportista ? deportistaVista(deportista, hoyISO()) : null;
}

export function avisosDeInscripcion(deportistaId: string, eventoId: string): AvisoInscripcion[] {
  const deportista = deportistaPorId.get(deportistaId);
  const evento = eventoPorId.get(eventoId);
  if (!deportista || !evento) return [];
  const tipo = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
  return avisosParaEvento(deportista, tipo, hoyISO());
}

// --- Campeonatos ----------------------------------------------------------------------------------------------

function estadoCampeonato(tipo: TipoCampeonato): 'finalizado' | 'en-curso' | 'proximo' {
  const delTipo = competencias.filter((c) => c.tipo === tipo);
  if (delTipo.some((c) => c.estado === 'curso')) return 'en-curso';
  if (delTipo.length > 0 && delTipo.every((c) => c.estado === 'finalizada')) return 'finalizado';
  return 'proximo';
}

function finalesDeTipo(tipo: TipoCampeonato): FinalParaTabla[] {
  const resultado: FinalParaTabla[] = [];
  for (const competencia of competencias.filter((c) => c.tipo === tipo)) {
    for (const serie of seriesDeCompetencia(competencia.id).filter(esFinalPublicada)) {
      const fase = obtener(fasePorId, serie.faseId, 'Fase');
      const evento = obtener(eventoPorId, fase.eventoId, 'Evento');
      const tipoEvento = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
      resultado.push({
        categoriaId: tipoEvento.categoriaId,
        genero: tipoEvento.genero,
        filas: filasCalculadas(serie, fase).map((fila) => {
          const inscripcion = obtener(inscripcionPorId, fila.inscripcionId, 'Inscripción');
          const club = obtener(clubPorId, inscripcion.clubId, 'Club');
          return {
            deportistas: inscripcion.deportistaIds.map((id) => {
              const d = obtener(deportistaPorId, id, 'Deportista');
              return { id: d.id, nombre: `${d.nombre} ${d.apellido}` };
            }),
            club: { id: club.id, nombre: club.nombre },
            posicion: fila.posicion,
            puntos: fila.puntos ?? 0,
          };
        }),
      });
    }
  }
  return resultado;
}

const textoGrupo = (grupo: { categoriaId: EventoCatalogo['categoriaId']; genero: EventoCatalogo['genero'] }) =>
  categoriaGenero(grupo);
const filtroGrupo = (grupo: { categoriaId: EventoCatalogo['categoriaId']; genero: EventoCatalogo['genero'] }) =>
  filtroCategoria(grupo);

export function campeonatos(): CampeonatoVista[] {
  return ORDEN_TIPOS.map((tipo) => ({
    tipo,
    nombre: NOMBRE_CAMPEONATO[tipo],
    estado: estadoCampeonato(tipo),
    competenciaIds: competencias
      .filter((c) => c.tipo === tipo)
      .sort((a, b) => a.diaInicio - b.diaInicio)
      .map((c) => c.id),
    // Solo los grupos que ya tienen alguna final publicada: una tabla vacía no se ofrece.
    grupos: tablaDeportistas(finalesDeTipo(tipo)).map((g) => ({ grupo: textoGrupo(g), filtro: filtroGrupo(g) })),
  }));
}

export function tablaCampeonato(
  tipo: TipoCampeonato,
  grupo?: string,
): { deportistas: FilaCampeonato[]; clubes: FilaCampeonato[] } {
  const finales = finalesDeTipo(tipo);
  const grupos = tablaDeportistas(finales);
  const elegido = grupo
    ? grupos.find((g) => textoGrupo(g) === grupo || filtroGrupo(g) === grupo)
    : grupos[0];
  const clubesDe = grupo
    ? finales.filter((f) => elegido && f.categoriaId === elegido.categoriaId && f.genero === elegido.genero)
    : finales;
  return {
    deportistas: (elegido?.filas ?? []).map((f) => ({
      posicion: f.posicion,
      id: f.id,
      nombre: f.nombre,
      club: obtener(clubPorId, obtener(deportistaPorId, f.id, 'Deportista').clubId, 'Club').nombre,
      puntos: f.puntos,
      finales: f.finales,
      primeros: f.primeros,
    })),
    clubes: tablaClubes(clubesDe).map((f) => ({
      posicion: f.posicion,
      id: f.id,
      nombre: f.nombre,
      puntos: f.puntos,
      finales: f.finales,
      primeros: f.primeros,
    })),
  };
}

export function fichaDeportista(id: string): FichaDeportista | null {
  const deportista = deportistaPorId.get(id);
  if (!deportista) return null;
  const hoy = hoyISO();
  const suyas = inscripciones.filter((i) => i.deportistaIds.includes(id));
  const suyasPorId = new Map(suyas.map((i) => [i.id, i]));

  const embarcaciones = new Set<Embarcacion>();
  const tripulaciones: FichaDeportista['tripulaciones'] = [];
  for (const inscripcion of suyas) {
    const evento = obtener(eventoPorId, inscripcion.eventoId, 'Evento');
    const tipo = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
    embarcaciones.add(tipo.embarcacion);
    if (inscripcion.deportistaIds.length > 1) {
      tripulaciones.push({
        eventoLectura: lecturaEvento(tipo),
        companeros: inscripcion.deportistaIds
          .filter((otro) => otro !== id)
          .map((otro) => {
            const d = obtener(deportistaPorId, otro, 'Deportista');
            return { id: d.id, nombreCompleto: `${d.nombre} ${d.apellido}` };
          }),
      });
    }
  }

  // Carreras publicadas en las que corrió, de la más reciente a la más vieja.
  const carreras = series
    .filter((s) => s.estado === 'publicada' && s.carriles.some((c) => suyasPorId.has(c.inscripcionId)))
    .sort((a, b) => b.dia - a.dia || b.hora.localeCompare(a.hora))
    .map((serie) => {
      const fase = obtener(fasePorId, serie.faseId, 'Fase');
      const evento = obtener(eventoPorId, fase.eventoId, 'Evento');
      const competencia = obtener(competenciaPorId, evento.competenciaId, 'Competencia');
      const tipo = obtener(catalogoPorId, evento.catalogoId, 'Evento de catálogo');
      const fila = filasCalculadas(serie, fase).find((f) => suyasPorId.has(f.inscripcionId));
      return { serie, fase, competencia, tipo, fila: fila as FilaCalculada };
    });

  const mejores = new Map<string, { cs: number; carrera: (typeof carreras)[number] }>();
  for (const carrera of carreras) {
    if (carrera.fila.tiempoCs === null) continue;
    const etiqueta = etiquetaEmbarcacion(carrera.tipo);
    const actual = mejores.get(etiqueta);
    if (!actual || carrera.fila.tiempoCs < actual.cs) mejores.set(etiqueta, { cs: carrera.fila.tiempoCs, carrera });
  }

  const campeonatosDeLaFicha: FichaDeportista['campeonatos'] = [];
  const categoriaId = categoriaEnTemporada(deportista, hoy);
  const grupo = categoriaId ? textoGrupo({ categoriaId, genero: deportista.sexo }) : null;
  for (const tipo of ORDEN_TIPOS) {
    const delTipo = competencias.filter((c) => c.tipo === tipo);
    const idsEventos = new Set(eventos.filter((e) => delTipo.some((c) => c.id === e.competenciaId)).map((e) => e.id));
    if (!suyas.some((i) => idsEventos.has(i.eventoId))) continue;
    const fila = grupo ? tablaCampeonato(tipo, grupo).deportistas.find((f) => f.id === id) : undefined;
    campeonatosDeLaFicha.push({
      tipo,
      nombre: NOMBRE_CAMPEONATO[tipo],
      estado: estadoCampeonato(tipo),
      fechasTexto: formatearRango(
        fechaRelativa(Math.min(...delTipo.map((c) => c.diaInicio)), hoy),
        fechaRelativa(Math.max(...delTipo.map((c) => c.diaFin)), hoy),
        'media',
      ),
      posicion: fila?.posicion ?? null,
      puntos: fila?.puntos ?? null,
      grupo,
    });
  }

  return {
    deportista: deportistaVista(deportista, hoy),
    embarcaciones: ORDEN_EMBARCACION.filter((e) => embarcaciones.has(e)),
    tripulaciones,
    mejoresTiempos: [...mejores.entries()]
      .sort(
        ([, a], [, b]) =>
          a.carrera.tipo.distancia - b.carrera.tipo.distancia ||
          ORDEN_EMBARCACION.indexOf(a.carrera.tipo.embarcacion) - ORDEN_EMBARCACION.indexOf(b.carrera.tipo.embarcacion),
      )
      .map(([etiqueta, { cs, carrera }]) => ({
        etiqueta,
        tiempo: formatearTiempo(cs),
        contexto: `${carrera.serie.nombre} · ${carrera.competencia.nombre} · ${formatearFecha(fechaRelativa(carrera.serie.dia, hoy), 'media')}`,
        serieId: carrera.serie.id,
        competenciaId: carrera.competencia.id,
      })),
    ultimasCarreras: carreras.slice(0, 5).map(({ serie, fase, competencia, tipo, fila }) => ({
      serieId: serie.id,
      competenciaId: competencia.id,
      titulo: `${serie.nombre} · ${etiquetaEmbarcacion(tipo)}`,
      competenciaNombre: competencia.nombre,
      fechaTexto: formatearFecha(fechaRelativa(serie.dia, hoy), 'media'),
      posicion: fila.posicion,
      tiempo: fila.tiempoCs === null ? null : formatearTiempo(fila.tiempoCs),
      ...(fila.codigo ? { codigo: fila.codigo } : {}),
      medalla: fila.medalla,
      esFinal: fase.tipo === 'final',
    })),
    campeonatos: campeonatosDeLaFicha,
  };
}

// --- Inscripciones --------------------------------------------------------------------------------------------

export function inscripcionesDeEvento(eventoId: string): BoteVista[] {
  const hoy = hoyISO();
  return inscripciones
    .filter((i) => i.eventoId === eventoId)
    .map((i) => boteVista(i, hoy))
    .sort(porClubYNumero);
}

export function inscripcionesDeClub(
  clubId: string,
  competenciaId?: string,
): { evento: Omit<EventoVista, 'fases'>; botes: BoteVista[] }[] {
  const hoy = hoyISO();
  const idsCompetencias = competenciaId ? [competenciaId] : competencias.map((c) => c.id);
  return idsCompetencias
    .flatMap((id) => eventosDe(id))
    .map((evento) => ({
      evento: eventoBase(evento),
      botes: inscripciones
        .filter((i) => i.eventoId === evento.id && i.clubId === clubId)
        .map((i) => boteVista(i, hoy))
        .sort((a, b) => a.numero - b.numero),
    }))
    .filter((grupo) => grupo.botes.length > 0);
}

// --- Clubes, equipo y catálogo ---------------------------------------------------------------------------------

function clubVista(club: (typeof clubes)[number]): ClubVista {
  const suyos = deportistas.filter((d) => d.clubId === club.id);
  return {
    id: club.id,
    nombre: club.nombre,
    sigla: club.sigla,
    ...(club.departamento ? { departamento: club.departamento } : {}),
    delegados: delegados
      .filter((d) => d.clubId === club.id)
      .map((d) => ({ id: d.id, nombre: d.nombre, principal: d.principal })),
    cantidadDeportistas: suyos.length,
    fichasVencidas: suyos.filter((d) => estadoFicha(d.fichaMedica) === 'vencida').length,
  };
}

export function listarClubes(): ClubVista[] {
  return [...clubes].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')).map(clubVista);
}

export function obtenerClub(id: string): ClubVista | null {
  const club = clubPorId.get(id);
  return club ? clubVista(club) : null;
}

export function listarEquipoFederacion(): MiembroEquipo[] {
  return equipoFederacion.map((m) => ({ ...m }));
}

export function catalogoDeEventos(): CatalogoVista[] {
  return [...catalogo]
    .sort(
      (a, b) =>
        ORDEN_EMBARCACION.indexOf(a.embarcacion) - ORDEN_EMBARCACION.indexOf(b.embarcacion) ||
        a.distancia - b.distancia ||
        CATEGORIAS.findIndex((c) => c.id === a.categoriaId) - CATEGORIAS.findIndex((c) => c.id === b.categoriaId) ||
        ORDEN_GENERO.indexOf(a.genero) - ORDEN_GENERO.indexOf(b.genero),
    )
    .map((c) => ({
      id: c.id,
      codigo: codigoEvento(c),
      lectura: lecturaEvento(c),
      embarcacion: c.embarcacion,
      distancia: c.distancia,
      categoriaId: c.categoriaId,
      categoriaTexto: nombreCategoria(c.categoriaId),
      genero: c.genero,
      generoTexto: textoGenero(c.genero),
      activo: c.activo,
      usos: eventos.filter((e) => e.catalogoId === c.id).length,
    }));
}

// --- Noticias y configuración -----------------------------------------------------------------------------------

function noticiaVista(noticia: (typeof noticias)[number], hoy: FechaISO): NoticiaVista {
  const fecha = fechaRelativa(noticia.dia, hoy);
  return {
    id: noticia.id,
    titulo: noticia.titulo,
    categoria: noticia.categoria,
    fecha,
    fechaTexto: formatearFecha(fecha, 'media'),
    foto: noticia.foto,
    alt: noticia.alt,
    resumen: noticia.resumen,
    cuerpo: [...noticia.cuerpo],
  };
}

export function listarNoticias(): NoticiaVista[] {
  const hoy = hoyISO();
  return [...noticias].sort((a, b) => b.dia - a.dia).map((n) => noticiaVista(n, hoy));
}

export function obtenerNoticia(id: string): NoticiaVista | null {
  const noticia = noticias.find((n) => n.id === id);
  return noticia ? noticiaVista(noticia, hoyISO()) : null;
}

export function configuracionFederacion(): ConfiguracionFederacion {
  return {
    categorias: CATEGORIAS.map((c) => ({ ...c })),
    tablaPuntos: [...TABLA_PUNTOS],
    avancePorDefecto: { cantidad: 3, texto: textoAvance({ cantidad: 3, destino: 'la siguiente fase' }) },
    cierreAutomatico: '23:59 del día de cierre',
  };
}
