import { parsearCodigoEvento } from '@/dominio/eventos';
import type { EventoCatalogo } from './tipos';

function evento(codigo: string, activo = true): EventoCatalogo {
  return { id: codigo.toLowerCase(), ...parsearCodigoEvento(codigo), activo };
}

/** Todos los eventos usados en las competencias, más otros activos y algunos dados de baja. */
export const catalogo: EventoCatalogo[] = [
  // Campeonato Nacional de Velocidad
  evento('K1-500-SENIOR-M'),
  evento('K1-500-SENIOR-F'),
  evento('C1-200-JUNIOR-M'),
  evento('K4-500-SENIOR-M'),
  evento('K2-500-JUNIOR-F'),
  evento('K1-200-JUNIOR-M'),
  // Medio Fondo
  evento('K1-5000-SENIOR-M'),
  evento('K1-5000-SENIOR-F'),
  evento('K2-5000-JUNIOR-F'),
  evento('K1-5000-JUNIOR-M'),
  // Promocional
  evento('K1-500-INFANTIL-M'),
  evento('K1-500-INFANTIL-F'),
  evento('K1-500-MENOR-M'),
  evento('K1-500-MENOR-F'),
  // Short Race
  evento('K1-3600-JUNIOR-F'),
  evento('K2-3600-JUNIOR-F'),
  evento('K4-3600-JUNIOR-F'),
  evento('K1-3600-CADETE-F'),
  evento('K2-3600-SENIOR-F'),
  evento('K1-3600-JUNIOR-M'),
  evento('K2-3600-JUNIOR-M'),
  evento('C1-3600-CADETE-M'),
  // Otros eventos activos
  evento('K1-1000-SENIOR-M'),
  evento('K1-1000-SENIOR-F'),
  evento('C2-500-SENIOR-M'),
  evento('K4-1000-JUNIOR-M'),
  evento('K1-500-MASTER_A-M'),
  evento('K1-200-SUB_23-F'),
  evento('K1-500-JUNIOR-M'),
  evento('K1-500-JUNIOR-F'),
  evento('K2-500-SENIOR-M'),
  evento('K2-500-SENIOR-F'),
  evento('C1-500-SENIOR-M'),
  evento('K1-500-CADETE-M'),
  // Dados de baja
  evento('K1-500-PRE_INFANTIL-M', false),
  evento('K2-200-MASTER_C-M', false),
  evento('C2-1000-SENIOR-F', false),
];
