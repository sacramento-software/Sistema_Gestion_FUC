import type { CategoriaId, Embarcacion, Genero } from '@/datos/tipos';
import { nombreCategoria } from './categorias';

export const TRIPULANTES: Record<Embarcacion, number> = { K1: 1, C1: 1, K2: 2, C2: 2, K4: 4 };

export interface DatosEvento {
  embarcacion: Embarcacion;
  distancia: number;
  categoriaId: CategoriaId;
  genero: Genero;
}

/** `K2-500-JUNIOR-F`. La categoría va tal como su id (`SUB_23`, `MASTER_A`). */
export function codigoEvento({ embarcacion, distancia, categoriaId, genero }: DatosEvento): string {
  return `${embarcacion}-${distancia}-${categoriaId}-${genero}`;
}

export function textoGenero(genero: Genero): string {
  if (genero === 'F') return 'Femenino';
  if (genero === 'M') return 'Masculino';
  return 'Mixto';
}

/** «K2 500 m · Junior · Femenino». */
export function lecturaEvento(evento: DatosEvento): string {
  return `${evento.embarcacion} ${evento.distancia} m · ${nombreCategoria(evento.categoriaId)} · ${textoGenero(evento.genero)}`;
}

/** «Junior · Femenino». */
export function categoriaGenero(evento: Pick<DatosEvento, 'categoriaId' | 'genero'>): string {
  return `${nombreCategoria(evento.categoriaId)} · ${textoGenero(evento.genero)}`;
}

/** «K1 500 m». */
export function etiquetaEmbarcacion(evento: Pick<DatosEvento, 'embarcacion' | 'distancia'>): string {
  return `${evento.embarcacion} ${evento.distancia} m`;
}

/** Slug para filtros: `junior-f`, `master-a-m`. */
export function filtroCategoria(evento: Pick<DatosEvento, 'categoriaId' | 'genero'>): string {
  return `${evento.categoriaId.toLowerCase().replace('_', '-')}-${evento.genero.toLowerCase()}`;
}

/** Inversa de `codigoEvento`: `K2-500-JUNIOR-F` a sus partes. */
export function parsearCodigoEvento(codigo: string): DatosEvento {
  const [embarcacion, distancia, categoriaId, genero] = codigo.split('-');
  return {
    embarcacion: embarcacion as Embarcacion,
    distancia: Number(distancia),
    categoriaId: categoriaId as CategoriaId,
    genero: genero as Genero,
  };
}
