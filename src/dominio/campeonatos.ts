import type { CategoriaId, Genero, TipoCampeonato } from '@/datos/tipos';
import { CATEGORIAS } from './categorias';

export const NOMBRE_CAMPEONATO: Record<TipoCampeonato, string> = {
  velocidad: 'Velocidad',
  'medio-fondo': 'Medio Fondo',
  'short-race': 'Short Race',
  promocional: 'Promocional (Ranking Menores)',
};

export interface ParticipanteFinal {
  id: string;
  nombre: string;
}

/** Una fila de una final ya calculada: el bote entero, con su posición y sus puntos. */
export interface FilaFinal {
  deportistas: ParticipanteFinal[];
  club: ParticipanteFinal;
  posicion: number | null;
  puntos: number;
}

export interface FinalParaTabla {
  categoriaId: CategoriaId;
  genero: Genero;
  filas: FilaFinal[];
}

export interface FilaTabla {
  posicion: number;
  id: string;
  nombre: string;
  puntos: number;
  finales: number;
  primeros: number;
}

export interface GrupoTabla {
  categoriaId: CategoriaId;
  genero: Genero;
  filas: FilaTabla[];
}

interface Acumulado {
  id: string;
  nombre: string;
  puntos: number;
  finales: number;
  primeros: number;
}

function acumular(
  mapa: Map<string, Acumulado>,
  vistosEnLaFinal: Set<string>,
  participante: ParticipanteFinal,
  puntos: number,
  posicion: number | null,
) {
  const actual = mapa.get(participante.id) ?? {
    id: participante.id,
    nombre: participante.nombre,
    puntos: 0,
    finales: 0,
    primeros: 0,
  };
  actual.puntos += puntos;
  // Una final cuenta una sola vez por participante, aunque un club tenga dos botes en ella.
  if (!vistosEnLaFinal.has(participante.id)) {
    vistosEnLaFinal.add(participante.id);
    actual.finales += 1;
  }
  if (posicion === 1) actual.primeros += 1;
  mapa.set(participante.id, actual);
}

/** Más puntos, después más primeros puestos y después alfabético. Empate de puntos: misma posición. */
function ordenar(acumulados: Acumulado[]): FilaTabla[] {
  const ordenados = [...acumulados].sort(
    (a, b) => b.puntos - a.puntos || b.primeros - a.primeros || a.nombre.localeCompare(b.nombre, 'es'),
  );
  const filas: FilaTabla[] = [];
  ordenados.forEach((fila, indice) => {
    const empata = indice > 0 && fila.puntos === ordenados[indice - 1].puntos;
    filas.push({ ...fila, posicion: empata ? filas[indice - 1].posicion : indice + 1 });
  });
  return filas;
}

const ORDEN_GENERO: Genero[] = ['F', 'M', 'X'];

/**
 * Una tabla por categoría y género del evento (el campeonato se gana en su categoría). En K2 y K4 cada
 * integrante suma los puntos del bote.
 */
export function tablaDeportistas(finales: FinalParaTabla[]): GrupoTabla[] {
  const grupos = new Map<string, { categoriaId: CategoriaId; genero: Genero; mapa: Map<string, Acumulado> }>();
  for (const final of finales) {
    const clave = `${final.categoriaId}|${final.genero}`;
    const grupo = grupos.get(clave) ?? { categoriaId: final.categoriaId, genero: final.genero, mapa: new Map() };
    const vistos = new Set<string>();
    for (const fila of final.filas) {
      for (const deportista of fila.deportistas) acumular(grupo.mapa, vistos, deportista, fila.puntos, fila.posicion);
    }
    grupos.set(clave, grupo);
  }
  const indiceCategoria = (id: CategoriaId) => CATEGORIAS.findIndex((c) => c.id === id);
  return [...grupos.values()]
    .sort(
      (a, b) =>
        indiceCategoria(a.categoriaId) - indiceCategoria(b.categoriaId) ||
        ORDEN_GENERO.indexOf(a.genero) - ORDEN_GENERO.indexOf(b.genero),
    )
    .map((g) => ({ categoriaId: g.categoriaId, genero: g.genero, filas: ordenar([...g.mapa.values()]) }));
}

/** El bote suma una sola vez para su club, aunque lo integren dos o cuatro personas. */
export function tablaClubes(finales: FinalParaTabla[]): FilaTabla[] {
  const mapa = new Map<string, Acumulado>();
  for (const final of finales) {
    const vistos = new Set<string>();
    for (const fila of final.filas) acumular(mapa, vistos, fila.club, fila.puntos, fila.posicion);
  }
  return ordenar([...mapa.values()]);
}
