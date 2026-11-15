import type { CategoriaId, FechaISO } from '@/datos/tipos';
import { anioTemporada } from './fechas';

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  desde: number;
  /** `null` = sin tope. */
  hasta: number | null;
}

export const CATEGORIAS: Categoria[] = [
  { id: 'PRE_INFANTIL', nombre: 'Pre infantil', desde: 9, hasta: 10 },
  { id: 'INFANTIL', nombre: 'Infantil', desde: 11, hasta: 12 },
  { id: 'MENOR', nombre: 'Menor', desde: 13, hasta: 14 },
  { id: 'CADETE', nombre: 'Cadete', desde: 15, hasta: 16 },
  { id: 'JUNIOR', nombre: 'Junior', desde: 17, hasta: 18 },
  { id: 'SUB_21', nombre: 'Sub 21', desde: 19, hasta: 21 },
  { id: 'SUB_23', nombre: 'Sub 23', desde: 22, hasta: 23 },
  { id: 'SENIOR', nombre: 'Senior', desde: 24, hasta: 35 },
  { id: 'MASTER_A', nombre: 'Máster A', desde: 36, hasta: 40 },
  { id: 'MASTER_B', nombre: 'Máster B', desde: 41, hasta: 45 },
  { id: 'MASTER_C', nombre: 'Máster C', desde: 46, hasta: null },
];

export function nombreCategoria(id: CategoriaId): string {
  return CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;
}

/** Menos de 9 años: `null`. */
export function categoriaPorEdad(edad: number): CategoriaId | null {
  const categoria = CATEGORIAS.find((c) => edad >= c.desde && (c.hasta === null || edad <= c.hasta));
  return categoria?.id ?? null;
}

/**
 * Categoría = año de la temporada menos año de nacimiento. Todas las competencias de la demo son de la
 * temporada actual (año de hoy), así que la categoría no cambia según el día en que se mire.
 */
export function categoriaEnTemporada(deportista: { edad: number }, hoy?: FechaISO): CategoriaId | null {
  const temporada = anioTemporada(hoy);
  const nacimiento = anioTemporada(hoy) - deportista.edad;
  return categoriaPorEdad(temporada - nacimiento);
}
