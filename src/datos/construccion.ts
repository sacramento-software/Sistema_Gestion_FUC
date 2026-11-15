// Auxiliares para escribir los programas sin repetir estructura. No hay nada aleatorio: todo es literal.
import { sumarMinutos } from '@/dominio/fechas';
import { parsearTiempo } from '@/dominio/tiempos';
import { deportistas } from './deportistas';
import { slug } from './texto';
import type {
  Carril,
  CodigoResultado,
  EstadoSerie,
  Evento,
  Fase,
  Hora,
  Inscripcion,
  Resultado,
  Serie,
  TipoFase,
} from './tipos';

const deportistaPorId = new Map(deportistas.map((d) => [d.id, d]));
const clubPorDeportista = (id: string) => {
  const deportista = deportistaPorId.get(id);
  if (!deportista) throw new Error(`Deportista inexistente: ${id}`);
  return deportista.clubId;
};

/** Sigla en minúsculas para los ids de inscripción: `club-nautico-montevideo` da `cnm`. */
const SIGLA_POR_CLUB = new Map<string, string>(Object.entries({
  'acal-nautico-club': 'acal',
  'club-nautico-montevideo': 'cnm',
  'remeros-de-colonia': 'rco',
  'club-remeros-salto': 'crs',
  'canoas-del-plata': 'cdp',
  'club-kayak-maldonado': 'ckm',
  'club-nautico-paysandu': 'cnp',
  'club-nautico-santa-lucia': 'cnsl',
  'club-nautico-mercedes': 'cnme',
  'kayak-club-rocha': 'kcr',
}));

export function crearEvento(competenciaId: string, prefijo: string, codigo: string): Evento {
  const catalogoId = codigo.toLowerCase();
  return { id: `${prefijo}-${catalogoId}`, competenciaId, catalogoId };
}

/**
 * Cada bote es la lista de ids de sus deportistas; el club es el del primero. El número es el «Bote N»
 * del club en ese evento, en el orden en que se escriben.
 */
export function crearInscripciones(eventoId: string, botes: string[][]): Inscripcion[] {
  const contador = new Map<string, number>();
  return botes.map((deportistaIds) => {
    const clubId = clubPorDeportista(deportistaIds[0]);
    const numero = (contador.get(clubId) ?? 0) + 1;
    contador.set(clubId, numero);
    return { id: `${eventoId}-${SIGLA_POR_CLUB.get(clubId)}-${numero}`, eventoId, clubId, numero, deportistaIds };
  });
}

/** Id de la inscripción en la que va un deportista. */
export function idInscripcion(inscripciones: Inscripcion[], deportistaId: string): string {
  const inscripcion = inscripciones.find((i) => i.deportistaIds.includes(deportistaId));
  if (!inscripcion) throw new Error(`${deportistaId} no está inscripto en ${inscripciones[0]?.eventoId}`);
  return inscripcion.id;
}

export const dsq = (motivo: string, detalle?: string): Resultado => ({ codigo: 'DSQ', motivo, ...(detalle ? { detalle } : {}) });
export const dns = (motivo: string): Resultado => ({ codigo: 'DNS' as CodigoResultado, motivo });
export const dnf = (motivo: string): Resultado => ({ codigo: 'DNF' as CodigoResultado, motivo });

/** Un carril: número, deportista (el primero del bote) y tiempo `m:ss.cc`, código, o nada si no hay resultado. */
export type FilaCarril = [numero: number, deportistaId: string, resultado?: string | Resultado];

export function carriles(inscripciones: Inscripcion[], filas: FilaCarril[]): Carril[] {
  return filas.map(([numero, deportistaId, resultado]) => {
    const carril: Carril = { numero, inscripcionId: idInscripcion(inscripciones, deportistaId) };
    if (typeof resultado === 'string') carril.resultado = { tiempoCs: parsearTiempo(resultado) };
    else if (resultado) carril.resultado = resultado;
    return carril;
  });
}

const FASES: Record<TipoFase, { slug: string; nombre: Fase['nombre']; orden: number }> = {
  eliminatoria: { slug: 'eliminatorias', nombre: 'Eliminatorias', orden: 1 },
  repechaje: { slug: 'repechaje', nombre: 'Repechaje', orden: 2 },
  semifinal: { slug: 'semifinal', nombre: 'Semifinal', orden: 3 },
  final: { slug: 'final', nombre: 'Final', orden: 4 },
};

export function idFase(eventoId: string, tipo: TipoFase): string {
  return `${eventoId}-${FASES[tipo].slug}`;
}

export function crearFase(
  eventoId: string,
  tipo: TipoFase,
  dia: number,
  hora: Hora,
  avance?: Fase['avance'],
): Fase {
  const { nombre, orden } = FASES[tipo];
  return { id: idFase(eventoId, tipo), eventoId, tipo, nombre, orden, dia, hora, ...(avance ? { avance } : {}) };
}

export function crearSerie(
  eventoId: string,
  tipo: TipoFase,
  nombre: string,
  estado: EstadoSerie,
  dia: number,
  hora: Hora,
  carrilesDeLaSerie: Carril[],
  opciones: { largada?: Hora; publicada?: Hora } = {},
): Serie {
  const serie: Serie = {
    id: `${eventoId}-${slug(nombre)}`,
    faseId: idFase(eventoId, tipo),
    nombre,
    dia,
    hora,
    estado,
    carriles: carrilesDeLaSerie,
  };
  if (estado !== 'armada') serie.largada = opciones.largada ?? sumarMinutos(hora, 1);
  if (estado === 'publicada') {
    if (!opciones.publicada) throw new Error(`Falta la hora de publicación de ${serie.id}`);
    serie.publicada = opciones.publicada;
  }
  return serie;
}
