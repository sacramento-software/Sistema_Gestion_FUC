// Test de integridad de los datos de demo (sección 9 de la spec 3): recorre los registros y falla ante
// cualquier incoherencia. Si alguien cambia un tiempo, un carril o una inscripción, esto lo detecta.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CLUB_DELEGADO_ID, USUARIOS_DEMO } from '@/lib/roles';
import { categoriaEnTemporada } from '@/dominio/categorias';
import { TRIPULANTES } from '@/dominio/eventos';
import { calcularResultados } from '@/dominio/resultados';
import { formatearTiempo, parsearTiempo } from '@/dominio/tiempos';
import { catalogo } from './catalogo';
import { clubes } from './clubes';
import { competencias, eventos, fases, series } from './competencias';
import { deportistas } from './deportistas';
import { elegiblesParaFase, fasesDeEvento, seriesDeFase } from './flujo';
import { inscripciones } from './inscripciones';
import { noticias } from './noticias';
import { delegados, equipoFederacion } from './personas';
import { slug } from './texto';

const clubPorId = new Map(clubes.map((c) => [c.id, c]));
const deportistaPorId = new Map(deportistas.map((d) => [d.id, d]));
const catalogoPorId = new Map(catalogo.map((c) => [c.id, c]));
const eventoPorId = new Map(eventos.map((e) => [e.id, e]));
const fasePorId = new Map(fases.map((f) => [f.id, f]));
const inscripcionPorId = new Map(inscripciones.map((i) => [i.id, i]));

const repetidos = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

/** Deportista (el primero del bote) de cada carril, para comparar contra los datos fijos de la spec. */
const carrilesDe = (serieId: string) => {
  const serie = series.find((s) => s.id === serieId);
  if (!serie) throw new Error(`No existe la serie ${serieId}`);
  return serie.carriles.map((c) => ({
    numero: c.numero,
    deportistas: inscripcionPorId.get(c.inscripcionId)!.deportistaIds,
    clubId: inscripcionPorId.get(c.inscripcionId)!.clubId,
    resultado: c.resultado,
  }));
};

describe('ids', () => {
  it('no hay ids repetidos en ninguna colección', () => {
    const colecciones: Record<string, string[]> = {
      clubes: clubes.map((c) => c.id),
      deportistas: deportistas.map((d) => d.id),
      delegados: delegados.map((d) => d.id),
      equipo: equipoFederacion.map((m) => m.id),
      catalogo: catalogo.map((c) => c.id),
      competencias: competencias.map((c) => c.id),
      eventos: eventos.map((e) => e.id),
      fases: fases.map((f) => f.id),
      series: series.map((s) => s.id),
      inscripciones: inscripciones.map((i) => i.id),
      noticias: noticias.map((n) => n.id),
    };
    for (const [coleccion, ids] of Object.entries(colecciones)) {
      expect(repetidos(ids), `ids repetidos en ${coleccion}`).toEqual([]);
    }
  });

  it('todo id referenciado existe', () => {
    const faltan: string[] = [];
    const existe = (cond: boolean, texto: string) => {
      if (!cond) faltan.push(texto);
    };
    for (const d of deportistas) existe(clubPorId.has(d.clubId), `deportista ${d.id} -> club ${d.clubId}`);
    for (const d of delegados) existe(clubPorId.has(d.clubId), `delegado ${d.id} -> club ${d.clubId}`);
    for (const e of eventos) {
      existe(competencias.some((c) => c.id === e.competenciaId), `evento ${e.id} -> competencia ${e.competenciaId}`);
      existe(catalogoPorId.has(e.catalogoId), `evento ${e.id} -> catálogo ${e.catalogoId}`);
    }
    for (const f of fases) existe(eventoPorId.has(f.eventoId), `fase ${f.id} -> evento ${f.eventoId}`);
    for (const s of series) {
      existe(fasePorId.has(s.faseId), `serie ${s.id} -> fase ${s.faseId}`);
      for (const c of s.carriles) existe(inscripcionPorId.has(c.inscripcionId), `serie ${s.id} -> inscripción ${c.inscripcionId}`);
    }
    for (const i of inscripciones) {
      existe(eventoPorId.has(i.eventoId), `inscripción ${i.id} -> evento ${i.eventoId}`);
      existe(clubPorId.has(i.clubId), `inscripción ${i.id} -> club ${i.clubId}`);
      for (const id of i.deportistaIds) existe(deportistaPorId.has(id), `inscripción ${i.id} -> deportista ${id}`);
    }
    expect(faltan).toEqual([]);
  });

  it('los ids siguen las convenciones de la spec', () => {
    const mal: string[] = [];
    for (const e of eventos) {
      if (!e.id.endsWith(e.catalogoId)) mal.push(`evento ${e.id}`);
    }
    for (const f of fases) {
      if (!f.id.startsWith(`${f.eventoId}-`)) mal.push(`fase ${f.id}`);
    }
    for (const s of series) {
      const fase = fasePorId.get(s.faseId)!;
      if (s.id !== `${fase.eventoId}-${slug(s.nombre)}`) mal.push(`serie ${s.id}`);
    }
    for (const i of inscripciones) {
      const sigla = clubPorId.get(i.clubId)!.sigla.toLowerCase();
      if (i.id !== `${i.eventoId}-${sigla}-${i.numero}`) mal.push(`inscripción ${i.id}`);
    }
    for (const d of deportistas) if (d.id !== slug(`${d.nombre} ${d.apellido}`)) mal.push(`deportista ${d.id}`);
    for (const c of catalogo) if (c.id !== c.id.toLowerCase()) mal.push(`catálogo ${c.id}`);
    expect(mal).toEqual([]);
  });
});

describe('personas', () => {
  it('no hay dos deportistas con el mismo nombre completo', () => {
    expect(repetidos(deportistas.map((d) => `${d.nombre} ${d.apellido}`))).toEqual([]);
  });

  it('ninguna persona del equipo ni delegado coincide con un deportista', () => {
    const nombres = new Set(deportistas.map((d) => `${d.nombre} ${d.apellido}`));
    expect(equipoFederacion.filter((m) => nombres.has(m.nombre)).map((m) => m.nombre)).toEqual([]);
    expect(delegados.filter((d) => nombres.has(d.nombre)).map((d) => d.nombre)).toEqual([]);
  });

  it('cada club tiene uno o dos delegados y exactamente un principal', () => {
    for (const club of clubes) {
      const suyos = delegados.filter((d) => d.clubId === club.id);
      expect(suyos.length, club.nombre).toBeGreaterThanOrEqual(1);
      expect(suyos.length, club.nombre).toBeLessThanOrEqual(2);
      expect(suyos.filter((d) => d.principal), club.nombre).toHaveLength(1);
    }
  });

  it('el usuario de la demo es un delegado de un club existente', () => {
    const clubId = USUARIOS_DEMO.delegado.clubId!;
    expect(clubPorId.has(clubId)).toBe(true);
    expect(clubId).toBe(CLUB_DELEGADO_ID);
    expect(delegados.find((d) => d.nombre === USUARIOS_DEMO.delegado.nombre)).toMatchObject({
      clubId,
      principal: true,
    });
    expect(equipoFederacion.find((m) => m.nombre === USUARIOS_DEMO.juez.nombre)?.rol).toBe('Juez central');
    // El usuario admin es la Federación: no es un miembro del equipo de jueces.
    expect(equipoFederacion.some((m) => m.nombre === USUARIOS_DEMO.federacion.nombre)).toBe(false);
  });

  it('cantidades de la spec', () => {
    expect(clubes).toHaveLength(10);
    expect(delegados).toHaveLength(14);
    expect(equipoFederacion.length).toBeGreaterThanOrEqual(9);
    expect(deportistas.length).toBeGreaterThanOrEqual(140);
    expect(deportistas.length).toBeLessThanOrEqual(160);
    expect(catalogo.length).toBeGreaterThanOrEqual(30);
    expect(catalogo.filter((c) => !c.activo).length).toBeGreaterThanOrEqual(2);
    expect(catalogo.filter((c) => !c.activo).length).toBeLessThanOrEqual(3);
    expect(noticias).toHaveLength(8);
  });

  it('el catálogo incluye los eventos de ejemplo de la spec', () => {
    for (const id of ['k1-1000-senior-m', 'c2-500-senior-m', 'k4-1000-junior-m', 'k1-500-master_a-m', 'k1-200-sub_23-f']) {
      expect(catalogoPorId.get(id)?.activo, id).toBe(true);
    }
    for (const e of eventos) expect(catalogoPorId.get(e.catalogoId)?.activo, e.id).toBe(true);
  });

  it('las fichas médicas de ACAL: 3 vencidas, 2 en trámite, unos 25 deportistas', () => {
    const acal = deportistas.filter((d) => d.clubId === CLUB_DELEGADO_ID);
    expect(acal.length).toBeGreaterThanOrEqual(24);
    expect(acal.length).toBeLessThanOrEqual(28);
    const vencidas = acal.filter((d) => 'venceEnDias' in d.fichaMedica && d.fichaMedica.venceEnDias < 0).map((d) => d.id);
    expect(vencidas.sort()).toEqual(['camila-pereyra', 'santiago-castro', 'valentina-acosta']);
    const tramite = acal.filter((d) => 'enTramite' in d.fichaMedica).map((d) => d.id);
    expect(tramite.sort()).toEqual(['agustina-rodriguez', 'facundo-olivera']);
    const sueltas = deportistas.filter(
      (d) => d.clubId !== CLUB_DELEGADO_ID && ('enTramite' in d.fichaMedica || d.fichaMedica.venceEnDias < 0),
    );
    expect(sueltas.length).toBeLessThanOrEqual(6);
  });

  it('el plantel de D3 existe con la categoría y la ficha que dice la spec', () => {
    const esperado: [string, string, 'vigente' | 'vencida' | 'tramite'][] = [
      ['sofia-mendez', 'JUNIOR', 'vigente'],
      ['camila-pereyra', 'JUNIOR', 'vencida'],
      ['lucia-fernandez', 'JUNIOR', 'vigente'],
      ['martina-silva', 'CADETE', 'vigente'],
      ['agustina-rodriguez', 'JUNIOR', 'tramite'],
      ['florencia-rivero', 'SENIOR', 'vigente'],
      ['valentina-acosta', 'CADETE', 'vencida'],
      ['mateo-gonzalez', 'JUNIOR', 'vigente'],
      ['santiago-castro', 'JUNIOR', 'vencida'],
      ['joaquin-suarez', 'CADETE', 'vigente'],
      ['facundo-olivera', 'SENIOR', 'tramite'],
      ['bruno-cabrera', 'JUNIOR', 'vigente'],
    ];
    for (const [id, categoria, ficha] of esperado) {
      const d = deportistaPorId.get(id)!;
      expect(d, id).toBeDefined();
      expect(d.clubId).toBe(CLUB_DELEGADO_ID);
      expect(categoriaEnTemporada(d), id).toBe(categoria);
      const real = 'enTramite' in d.fichaMedica ? 'tramite' : d.fichaMedica.venceEnDias < 0 ? 'vencida' : 'vigente';
      expect(real, id).toBe(ficha);
    }
  });
});

describe('botes', () => {
  it('cada bote tiene los tripulantes de su embarcación y un solo club', () => {
    const mal: string[] = [];
    for (const i of inscripciones) {
      const tipo = catalogoPorId.get(eventoPorId.get(i.eventoId)!.catalogoId)!;
      if (i.deportistaIds.length !== TRIPULANTES[tipo.embarcacion]) mal.push(`${i.id}: tripulantes`);
      if (new Set(i.deportistaIds).size !== i.deportistaIds.length) mal.push(`${i.id}: deportista repetido`);
      for (const id of i.deportistaIds) {
        if (deportistaPorId.get(id)!.clubId !== i.clubId) mal.push(`${i.id}: ${id} es de otro club`);
      }
    }
    expect(mal).toEqual([]);
  });

  it('cada deportista coincide en sexo y categoría de la temporada con el evento', () => {
    const mal: string[] = [];
    for (const i of inscripciones) {
      const tipo = catalogoPorId.get(eventoPorId.get(i.eventoId)!.catalogoId)!;
      for (const id of i.deportistaIds) {
        const d = deportistaPorId.get(id)!;
        if (tipo.genero !== 'X' && d.sexo !== tipo.genero) mal.push(`${i.id}: ${id} sexo ${d.sexo}`);
        if (categoriaEnTemporada(d) !== tipo.categoriaId) mal.push(`${i.id}: ${id} categoría ${categoriaEnTemporada(d)}`);
      }
    }
    expect(mal).toEqual([]);
  });

  it('un mismo bote no se repite en un evento y los números de bote de cada club son 1, 2, 3...', () => {
    const mal: string[] = [];
    for (const evento of eventos) {
      const suyas = inscripciones.filter((i) => i.eventoId === evento.id);
      const claves = suyas.map((i) => [...i.deportistaIds].sort().join('+'));
      if (repetidos(claves).length) mal.push(`${evento.id}: bote repetido`);
      const personas = suyas.flatMap((i) => i.deportistaIds);
      if (repetidos(personas).length) mal.push(`${evento.id}: deportista en dos botes`);
      for (const club of clubes) {
        const numeros = suyas.filter((i) => i.clubId === club.id).map((i) => i.numero).sort((a, b) => a - b);
        if (numeros.some((n, indice) => n !== indice + 1)) mal.push(`${evento.id}: numeración de ${club.sigla}`);
      }
    }
    expect(mal).toEqual([]);
  });

  it('los del Promocional tienen entre 9 y 14 años', () => {
    const edades = inscripciones
      .filter((i) => eventoPorId.get(i.eventoId)!.competenciaId === 'nacional-promocional')
      .flatMap((i) => i.deportistaIds.map((id) => deportistaPorId.get(id)!.edad));
    expect(Math.min(...edades)).toBeGreaterThanOrEqual(9);
    expect(Math.max(...edades)).toBeLessThanOrEqual(14);
  });
});

describe('series', () => {
  it('los carriles van de 1 a 9, no se repiten y un bote no aparece dos veces en una serie ni en dos series de la fase', () => {
    const mal: string[] = [];
    for (const serie of series) {
      const numeros = serie.carriles.map((c) => c.numero);
      if (numeros.some((n) => !Number.isInteger(n) || n < 1 || n > 9)) mal.push(`${serie.id}: carril fuera de 1 a 9`);
      if (repetidos(numeros.map(String)).length) mal.push(`${serie.id}: carril repetido`);
      if (repetidos(serie.carriles.map((c) => c.inscripcionId)).length) mal.push(`${serie.id}: bote repetido`);
    }
    for (const fase of fases) {
      const ids = seriesDeFase(fase.id).flatMap((s) => s.carriles.map((c) => c.inscripcionId));
      if (repetidos(ids).length) mal.push(`${fase.id}: bote en dos series`);
    }
    expect(mal).toEqual([]);
  });

  it('el estado de cada serie es coherente con sus resultados', () => {
    const mal: string[] = [];
    for (const s of series) {
      const conResultado = s.carriles.filter((c) => c.resultado).length;
      if (s.estado === 'armada' && conResultado > 0) mal.push(`${s.id}: armada con resultados`);
      if (s.estado === 'en-vivo' && (conResultado === 0 || conResultado === s.carriles.length)) {
        mal.push(`${s.id}: en vivo sin resultados parciales`);
      }
      if ((s.estado === 'terminada' || s.estado === 'publicada') && conResultado !== s.carriles.length) {
        mal.push(`${s.id}: ${s.estado} con carriles sin resultado`);
      }
      if (s.estado === 'armada' && (s.largada || s.publicada)) mal.push(`${s.id}: armada con largada o publicación`);
      if (s.estado !== 'armada' && !s.largada) mal.push(`${s.id}: sin hora de largada`);
      if (s.estado === 'publicada' && !s.publicada) mal.push(`${s.id}: publicada sin hora`);
      if (s.estado !== 'publicada' && s.publicada) mal.push(`${s.id}: ${s.estado} con hora de publicación`);
    }
    expect(mal).toEqual([]);
  });

  it('no hay dos tiempos iguales en una serie', () => {
    const mal = series.filter((s) => {
      const tiempos = s.carriles.flatMap((c) => (c.resultado && 'tiempoCs' in c.resultado ? [String(c.resultado.tiempoCs)] : []));
      return repetidos(tiempos).length > 0;
    });
    expect(mal.map((s) => s.id)).toEqual([]);
  });

  it('cada tiempo cae dentro del rango de su evento', () => {
    const t = (texto: string) => parsearTiempo(texto);
    const rangos: Record<string, [number, number]> = {
      'k1-500-senior-m': [t('1:40.00'), t('1:50.00')],
      'k1-500-senior-f': [t('1:52.00'), t('2:02.00')],
      'k4-500-senior-m': [t('1:28.00'), t('1:36.00')],
      'c1-200-junior-m': [t('42.00'), t('48.00')],
      'k1-200-junior-m': [t('38.00'), t('43.00')],
      'k1-5000-senior-m': [t('20:00.00'), t('27:00.00')],
      'k1-5000-senior-f': [t('20:00.00'), t('27:00.00')],
      'k2-5000-junior-f': [t('20:00.00'), t('27:00.00')],
      'k1-5000-junior-m': [t('20:00.00'), t('27:00.00')],
      'k1-500-infantil-m': [t('2:15.00'), t('3:05.00')],
      'k1-500-infantil-f': [t('2:15.00'), t('3:05.00')],
      'k1-500-menor-m': [t('2:15.00'), t('3:05.00')],
      'k1-500-menor-f': [t('2:15.00'), t('3:05.00')],
    };
    const mal: string[] = [];
    for (const s of series) {
      const catalogoId = eventoPorId.get(fasePorId.get(s.faseId)!.eventoId)!.catalogoId;
      for (const c of s.carriles) {
        if (!c.resultado || !('tiempoCs' in c.resultado)) continue;
        const rango = rangos[catalogoId];
        if (!rango) mal.push(`${s.id}: el evento ${catalogoId} no tiene rango de tiempos definido`);
        else if (c.resultado.tiempoCs < rango[0] || c.resultado.tiempoCs > rango[1]) {
          mal.push(`${s.id}: carril ${c.numero} con ${formatearTiempo(c.resultado.tiempoCs)} fuera de rango`);
        }
      }
    }
    expect(mal).toEqual([]);
  });

  it('el flujo entre fases cierra: quién corre cada fase sale de los resultados de la anterior', () => {
    const mal: string[] = [];
    for (const evento of eventos) {
      for (const fase of fasesDeEvento(evento.id)) {
        const delaFase = seriesDeFase(fase.id);
        if (delaFase.length === 0) continue; // fase prevista: todavía sin series
        const enSeries = delaFase.flatMap((s) => s.carriles.map((c) => c.inscripcionId));
        const elegibles = elegiblesParaFase(fase);
        if (elegibles === null) {
          mal.push(`${fase.id}: tiene series pero la fase previa no tiene resultados completos`);
          continue;
        }
        const sobran = enSeries.filter((id) => !elegibles.has(id));
        const faltan = [...elegibles].filter((id) => !enSeries.includes(id));
        if (sobran.length) mal.push(`${fase.id}: no deberían correr ${sobran.join(', ')}`);
        if (faltan.length) mal.push(`${fase.id}: faltan ${faltan.join(', ')}`);
      }
    }
    expect(mal).toEqual([]);
  });

  it('las fases tienen sentido: una por tipo, en orden, y con avance las que mandan a otra', () => {
    const mal: string[] = [];
    for (const evento of eventos) {
      const delEvento = fasesDeEvento(evento.id);
      if (repetidos(delEvento.map((f) => f.tipo)).length) mal.push(`${evento.id}: fase repetida`);
      if (delEvento[delEvento.length - 1].tipo !== 'final') mal.push(`${evento.id}: no termina en Final`);
      for (const f of delEvento) {
        const esUltima = f === delEvento[delEvento.length - 1];
        if (esUltima && f.avance) mal.push(`${f.id}: la última fase no avanza a ninguna parte`);
        if (!esUltima && !f.avance) mal.push(`${f.id}: falta el avance`);
      }
    }
    expect(mal).toEqual([]);
  });
});

describe('datos fijos de la spec', () => {
  it('competencias: fechas relativas, estados y cierre', () => {
    const c = (id: string) => competencias.find((x) => x.id === id)!;
    expect(c('nacional-velocidad')).toMatchObject({ diaInicio: 0, diaFin: 1, estado: 'curso', sede: 'Lago Calcagno' });
    expect(c('nacional-short-race')).toMatchObject({
      diaInicio: 6,
      diaFin: 7,
      estado: 'abiertas',
      cierreInscripcion: { dia: 3, hora: '23:59' },
      sede: 'San Gregorio de Polanco, Río Negro',
    });
    expect(c('nacional-medio-fondo')).toMatchObject({ diaInicio: -40, diaFin: -39, estado: 'finalizada' });
    expect(c('nacional-promocional')).toMatchObject({ diaInicio: -110, diaFin: -109, estado: 'finalizada' });
    // El cierre es anterior al inicio.
    expect(c('nacional-short-race').cierreInscripcion!.dia).toBeLessThan(c('nacional-short-race').diaInicio);
  });

  it('la Semifinal 1 es exactamente la de J1 y P5', () => {
    const s = series.find((x) => x.id === 'vel-k1-500-senior-m-semifinal-1')!;
    expect(s).toMatchObject({ estado: 'en-vivo', hora: '10:40', largada: '10:41', dia: 0 });
    const filas = carrilesDe(s.id).map((c) => [
      c.numero,
      c.deportistas[0],
      clubPorId.get(c.clubId)!.sigla,
      c.resultado && 'tiempoCs' in c.resultado ? formatearTiempo(c.resultado.tiempoCs) : null,
    ]);
    expect(filas).toEqual([
      [1, 'matias-olivera', 'CRS', null],
      [2, 'federico-sosa', 'CDP', null],
      [3, 'gonzalo-barrios', 'CNM', '1:43.40'],
      [4, 'martin-rodriguez', 'CNM', '1:41.27'],
      [5, 'santiago-pereira', 'RCO', '1:42.05'],
      [6, 'nicolas-pintos', 'ACAL', '1:42.91'],
      [7, 'facundo-techera', 'CKM', '1:44.62'],
      [8, 'rodrigo-ferrari', 'CNP', null],
    ]);
  });

  it('Ferrari, Méndez y Fontes llegan del repechaje y Arias, Correa y Cabrera están en la Semifinal 2', () => {
    const repechaje = calcularResultados(
      series.find((s) => s.id === 'vel-k1-500-senior-m-repechaje')!.carriles,
      { tipoFase: 'repechaje', avance: fasePorId.get('vel-k1-500-senior-m-repechaje')!.avance },
    ).filter((f) => f.clasificado);
    const delRepechaje = repechaje.map((f) => inscripcionPorId.get(f.inscripcionId)!.deportistaIds[0]);
    for (const id of ['rodrigo-ferrari', 'diego-mendez', 'lucas-fontes']) expect(delRepechaje).toContain(id);
    const semi2 = carrilesDe('vel-k1-500-senior-m-semifinal-2').map((c) => c.deportistas[0]);
    for (const id of ['tomas-arias', 'bruno-correa', 'joaquin-cabrera']) expect(semi2).toContain(id);
  });

  it('las eliminatorias de K2 500 m Junior Femenino tienen los 14 botes de J2b', () => {
    const botes = (id: string) => carrilesDe(id).map((c) => c.deportistas.join('+'));
    expect(botes('vel-k2-500-junior-f-eliminatoria-1')).toEqual([
      'valentina-rios+camila-suarez',
      'agustina-silva+florencia-nunez',
      'delfina-arias+bianca-sosa',
      'catalina-viera+antonella-rosas',
      'isabel-techera+lara-machado',
      'victoria-pereyra+renata-olivera',
      'lucia-mendez+sofia-cabrera',
    ]);
    expect(botes('vel-k2-500-junior-f-eliminatoria-2')).toEqual([
      'paula-gomez+micaela-duarte',
      'martina-acosta+julieta-ferreira',
      'emilia-castro+josefina-bentancor',
      'guadalupe-leites+mia-correa',
      'abril-morales+candela-piriz',
      'rocio-ibarra+sol-martinez',
      'clara-fontes+ana-laura-brum',
    ]);
  });

  it('la jornada de hoy es la de la tabla 8.6, en ese orden y con esos estados', () => {
    const hoy = series
      .filter((s) => s.dia === 0 && fasePorId.get(s.faseId)!.eventoId.startsWith('vel-'))
      .sort((a, b) => a.hora.localeCompare(b.hora))
      .map((s) => [s.hora, s.id, s.estado, s.publicada ?? null]);
    expect(hoy).toEqual([
      ['09:00', 'vel-k1-500-senior-m-eliminatoria-1', 'publicada', '09:14'],
      ['09:10', 'vel-k1-500-senior-m-eliminatoria-2', 'publicada', '09:24'],
      ['09:20', 'vel-k1-500-senior-m-eliminatoria-3', 'publicada', '09:36'],
      ['09:30', 'vel-c1-200-junior-m-final-a', 'publicada', '09:42'],
      ['09:40', 'vel-k1-500-senior-f-eliminatoria-1', 'publicada', '09:55'],
      ['09:50', 'vel-k1-500-senior-f-eliminatoria-2', 'publicada', '10:04'],
      ['10:00', 'vel-k4-500-senior-m-final-a', 'publicada', '10:15'],
      ['10:10', 'vel-k1-500-senior-m-repechaje', 'terminada', null],
      ['10:40', 'vel-k1-500-senior-m-semifinal-1', 'en-vivo', null],
      ['10:50', 'vel-k1-500-senior-m-semifinal-2', 'armada', null],
      ['11:00', 'vel-k1-500-senior-f-final-a', 'armada', null],
      ['11:20', 'vel-k2-500-junior-f-eliminatoria-1', 'armada', null],
      ['11:30', 'vel-k2-500-junior-f-eliminatoria-2', 'armada', null],
    ]);
  });

  it('la eliminatoria 3 tiene un DSQ y la 2 femenina un DNS, con sus motivos', () => {
    const codigoDe = (serieId: string) =>
      carrilesDe(serieId).flatMap((c) => (c.resultado && 'codigo' in c.resultado ? [{ carril: c.numero, ...c.resultado }] : []));
    expect(codigoDe('vel-k1-500-senior-m-eliminatoria-3')).toEqual([
      { carril: 5, codigo: 'DSQ', motivo: 'Invadió otro carril', detalle: 'Carril 5, después de los 250 m' },
    ]);
    expect(codigoDe('vel-k1-500-senior-f-eliminatoria-2')).toEqual([
      { carril: 6, codigo: 'DNS', motivo: 'No se presentó a la largada' },
    ]);
  });

  it('mañana: dos eliminatorias armadas y tres finales sin series', () => {
    const manana = series.filter((s) => s.dia === 1 && fasePorId.get(s.faseId)!.eventoId.startsWith('vel-'));
    expect(manana.map((s) => [s.hora, s.id, s.estado])).toEqual([
      ['09:30', 'vel-k1-200-junior-m-eliminatoria-1', 'armada'],
      ['09:40', 'vel-k1-200-junior-m-eliminatoria-2', 'armada'],
    ]);
    const previstas = fases
      .filter((f) => f.tipo === 'final' && f.dia === 1 && f.eventoId.startsWith('vel-') && seriesDeFase(f.id).length === 0)
      .map((f) => [f.hora, f.eventoId])
      .sort();
    expect(previstas).toEqual([
      ['10:00', 'vel-k2-500-junior-f'],
      ['10:40', 'vel-k1-500-senior-m'],
      ['11:00', 'vel-k1-200-junior-m'],
    ]);
  });

  it('inscriptos y series del Campeonato Nacional de Velocidad', () => {
    const inscriptos = (id: string) => inscripciones.filter((i) => i.eventoId === id).length;
    expect(inscriptos('vel-k1-500-senior-m')).toBe(18);
    expect(inscriptos('vel-k1-500-senior-f')).toBe(12);
    expect(inscriptos('vel-c1-200-junior-m')).toBe(7);
    expect(inscriptos('vel-k4-500-senior-m')).toBe(5);
    expect(inscriptos('vel-k2-500-junior-f')).toBe(14);
    expect(inscriptos('vel-k1-200-junior-m')).toBe(14);
    const tamanios = (faseId: string) => seriesDeFase(faseId).map((s) => s.carriles.length);
    expect(tamanios('vel-k1-500-senior-m-eliminatorias')).toEqual([6, 6, 6]);
    expect(tamanios('vel-k1-500-senior-m-repechaje')).toEqual([5]);
    expect(tamanios('vel-k1-500-senior-m-semifinal')).toEqual([8, 8]);
    expect(tamanios('vel-k1-500-senior-f-eliminatorias')).toEqual([6, 6]);
    expect(tamanios('vel-k1-500-senior-f-final')).toEqual([8]);
    expect(tamanios('vel-k2-500-junior-f-eliminatorias')).toEqual([7, 7]);
    expect(tamanios('vel-k1-200-junior-m-eliminatorias')).toEqual([7, 7]);
    // Los clasificados de las eliminatorias femeninas son los 8 de la final y el DNS queda afuera.
    const final = new Set(seriesDeFase('vel-k1-500-senior-f-final')[0].carriles.map((c) => c.inscripcionId));
    const bonilla = inscripciones.find((i) => i.deportistaIds.includes('paola-bonilla') && i.eventoId === 'vel-k1-500-senior-f')!;
    expect(final.has(bonilla.id)).toBe(false);
  });

  it('Medio Fondo y Promocional: una final publicada por evento, y al menos un DNF', () => {
    for (const competenciaId of ['nacional-medio-fondo', 'nacional-promocional']) {
      for (const evento of eventos.filter((e) => e.competenciaId === competenciaId)) {
        const delEvento = fasesDeEvento(evento.id);
        expect(delEvento.map((f) => f.tipo), evento.id).toEqual(['final']);
        const suyas = seriesDeFase(delEvento[0].id);
        expect(suyas.map((s) => [s.nombre, s.estado]), evento.id).toEqual([['Final A', 'publicada']]);
        expect(suyas[0].dia).toBeLessThan(0);
      }
    }
    const medioFondo = series.filter((s) => s.id.startsWith('mf-'));
    expect(medioFondo.flatMap((s) => s.carriles).some((c) => c.resultado && 'codigo' in c.resultado && c.resultado.codigo === 'DNF')).toBe(true);
    const cantidad = (prefijo: string) => inscripciones.filter((i) => i.eventoId.startsWith(prefijo)).length;
    expect(cantidad('mf-k1-5000-senior-m')).toBe(9);
    expect(cantidad('mf-k1-5000-senior-f')).toBe(7);
    expect(cantidad('mf-k2-5000-junior-f')).toBe(6);
    expect(cantidad('mf-k1-5000-junior-m')).toBe(7);
    for (const evento of eventos.filter((e) => e.competenciaId === 'nacional-promocional')) {
      const n = inscripciones.filter((i) => i.eventoId === evento.id).length;
      expect(n, evento.id).toBeGreaterThanOrEqual(6);
      expect(n, evento.id).toBeLessThanOrEqual(8);
    }
    // Hay deportistas de ACAL en el Promocional.
    const acalPromocional = inscripciones.filter((i) => i.eventoId.startsWith('pro-') && i.clubId === CLUB_DELEGADO_ID);
    expect(acalPromocional.length).toBeGreaterThan(0);
  });

  it('el Medio Fondo comparte deportistas con el K1 500 m y tripulaciones con el K2 500 m', () => {
    const mf = inscripciones.find((i) => i.eventoId === 'mf-k1-5000-senior-m' && i.deportistaIds[0] === 'martin-rodriguez');
    expect(mf).toBeDefined();
    const ids = inscripciones.filter((i) => i.eventoId === 'mf-k1-5000-senior-m').map((i) => i.deportistaIds[0]);
    for (const id of ['martin-rodriguez', 'santiago-pereira', 'nicolas-pintos']) expect(ids).toContain(id);
    const k2 = new Set(inscripciones.filter((i) => i.eventoId === 'vel-k2-500-junior-f').map((i) => i.deportistaIds.join('+')));
    for (const i of inscripciones.filter((x) => x.eventoId === 'mf-k2-5000-junior-f')) {
      expect(k2.has(i.deportistaIds.join('+')), i.id).toBe(true);
    }
  });

  it('Short Race: ocho eventos de 3600 m con una Final prevista el día 6, sin series', () => {
    const delTipo = eventos.filter((e) => e.competenciaId === 'nacional-short-race');
    expect(delTipo.map((e) => catalogoPorId.get(e.catalogoId)!.id.toUpperCase()).sort()).toEqual(
      [
        'K1-3600-JUNIOR-F',
        'K2-3600-JUNIOR-F',
        'K4-3600-JUNIOR-F',
        'K1-3600-CADETE-F',
        'K2-3600-SENIOR-F',
        'K1-3600-JUNIOR-M',
        'K2-3600-JUNIOR-M',
        'C1-3600-CADETE-M',
      ].sort(),
    );
    for (const evento of delTipo) {
      expect(catalogoPorId.get(evento.catalogoId)!.distancia).toBe(3600);
      const delEvento = fasesDeEvento(evento.id);
      expect(delEvento).toHaveLength(1);
      expect(delEvento[0]).toMatchObject({ tipo: 'final', dia: 6 });
      expect(delEvento[0].hora >= '09:00' && delEvento[0].hora <= '12:30', evento.id).toBe(true);
      expect(seriesDeFase(delEvento[0].id)).toEqual([]);
      const n = inscripciones.filter((i) => i.eventoId === evento.id).length;
      expect(n, evento.id).toBeGreaterThanOrEqual(2);
      expect(n, evento.id).toBeLessThanOrEqual(6);
    }
  });

  it('inscripciones de ACAL en la Short Race (las de D3)', () => {
    const acal = inscripciones
      .filter((i) => i.clubId === CLUB_DELEGADO_ID && i.eventoId.startsWith('sr-'))
      .map((i) => [i.eventoId, i.numero, i.deportistaIds.join('+')]);
    expect(acal).toEqual([
      ['sr-k2-3600-junior-f', 1, 'lucia-fernandez+agustina-rodriguez'],
      ['sr-k1-3600-cadete-f', 1, 'martina-silva'],
      ['sr-k1-3600-junior-m', 1, 'mateo-gonzalez'],
    ]);
  });

  it('ACAL aparece en casi todos los eventos de la Velocidad', () => {
    const delVelocidad = eventos.filter((e) => e.competenciaId === 'nacional-velocidad');
    const conAcal = delVelocidad.filter((e) => inscripciones.some((i) => i.eventoId === e.id && i.clubId === CLUB_DELEGADO_ID));
    expect(conAcal.length).toBeGreaterThanOrEqual(delVelocidad.length - 1);
  });

  it('la noticia de Medio Fondo nombra a los ganadores que salen de los datos', () => {
    const noticia = noticias.find((n) => n.categoria === 'Medio Fondo')!;
    const texto = noticia.cuerpo.join(' ') + ' ' + noticia.resumen;
    for (const serie of series.filter((s) => s.id.startsWith('mf-'))) {
      const fase = fasePorId.get(serie.faseId)!;
      const primero = calcularResultados(serie.carriles, { tipoFase: fase.tipo })[0];
      const ganadores = inscripcionPorId.get(primero.inscripcionId)!.deportistaIds.map((id) => {
        const d = deportistaPorId.get(id)!;
        return `${d.nombre} ${d.apellido}`;
      });
      for (const nombre of ganadores) expect(texto, `falta ${nombre}`).toContain(nombre);
    }
  });

  it('las noticias tienen 2 a 4 párrafos, foto existente y la lista de la spec', () => {
    expect(noticias.map((n) => [n.dia, n.categoria]).sort((a, b) => Number(a[0]) - Number(b[0]))).toEqual([
      [-105, 'Promocional'],
      [-60, 'Clubes'],
      [-38, 'Medio Fondo'],
      [-35, 'Federación'],
      [-28, 'Escuelas'],
      [-20, 'Selección'],
      [-9, 'Regatas'],
      [-1, 'Velocidad'],
    ]);
    for (const n of noticias) {
      expect(n.cuerpo.length, n.id).toBeGreaterThanOrEqual(2);
      expect(n.cuerpo.length, n.id).toBeLessThanOrEqual(4);
      expect(n.foto.startsWith('/imagenes/'), n.id).toBe(true);
      expect(existsSync(path.join(process.cwd(), 'public', n.foto)), `${n.id}: falta ${n.foto}`).toBe(true);
      expect(n.alt.length, n.id).toBeGreaterThan(0);
    }
  });
});
