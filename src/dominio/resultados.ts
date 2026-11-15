import type { Carril, CodigoResultado, TipoFase } from '@/datos/tipos';

export const TABLA_PUNTOS = [10, 8, 6, 5, 4, 3, 2, 1];

export type Medalla = 'oro' | 'plata' | 'bronce';

export interface Avance {
  cantidad: number;
  destino: string;
}

export interface FilaCalculada {
  /** `null` para los códigos (DSQ, DNS, DNF). */
  posicion: number | null;
  numero: number;
  inscripcionId: string;
  tiempoCs: number | null;
  /** Diferencia con el primero; `null` para el primero y para los códigos. */
  diferenciaCs: number | null;
  codigo?: CodigoResultado;
  motivo?: string;
  detalle?: string;
  /** Solo en finales; fuera de ellas, `null`. */
  puntos: number | null;
  /** Solo en finales, posiciones 1 a 3. */
  medalla: Medalla | null;
  clasificado: boolean;
}

const ORDEN_CODIGOS: Record<CodigoResultado, number> = { DNF: 0, DSQ: 1, DNS: 2 };

const MEDALLAS: Medalla[] = ['oro', 'plata', 'bronce'];

/**
 * Ordena por tiempo y calcula posición, diferencia, puntos, medalla y clasificados.
 * Los códigos van al final (DNF, DSQ, DNS y, dentro de cada uno, por carril). Un carril sin resultado no
 * entra. Si dos tiempos son iguales comparten posición y la siguiente se saltea.
 */
export function calcularResultados(
  carriles: Carril[],
  opciones: { tipoFase: TipoFase; avance?: Avance },
): FilaCalculada[] {
  const { tipoFase, avance } = opciones;
  const esFinal = tipoFase === 'final';

  const conTiempo: { carril: Carril; tiempoCs: number }[] = [];
  const conCodigo: { carril: Carril; codigo: CodigoResultado; motivo: string; detalle?: string }[] = [];
  for (const carril of carriles) {
    const r = carril.resultado;
    if (!r) continue;
    if ('tiempoCs' in r) conTiempo.push({ carril, tiempoCs: r.tiempoCs });
    else conCodigo.push({ carril, codigo: r.codigo, motivo: r.motivo, detalle: r.detalle });
  }
  conTiempo.sort((a, b) => a.tiempoCs - b.tiempoCs || a.carril.numero - b.carril.numero);
  conCodigo.sort((a, b) => ORDEN_CODIGOS[a.codigo] - ORDEN_CODIGOS[b.codigo] || a.carril.numero - b.carril.numero);

  const primero = conTiempo[0]?.tiempoCs ?? 0;
  const filas: FilaCalculada[] = [];
  let posicionAnterior = 0;
  conTiempo.forEach((fila, indice) => {
    const empata = indice > 0 && fila.tiempoCs === conTiempo[indice - 1].tiempoCs;
    const posicion = empata ? posicionAnterior : indice + 1;
    posicionAnterior = posicion;
    filas.push({
      posicion,
      numero: fila.carril.numero,
      inscripcionId: fila.carril.inscripcionId,
      tiempoCs: fila.tiempoCs,
      diferenciaCs: posicion === 1 ? null : fila.tiempoCs - primero,
      puntos: esFinal ? (TABLA_PUNTOS[posicion - 1] ?? 0) : null,
      medalla: esFinal && posicion <= 3 ? MEDALLAS[posicion - 1] : null,
      clasificado: avance !== undefined && posicion <= avance.cantidad,
    });
  });
  for (const fila of conCodigo) {
    filas.push({
      posicion: null,
      numero: fila.carril.numero,
      inscripcionId: fila.carril.inscripcionId,
      tiempoCs: null,
      diferenciaCs: null,
      codigo: fila.codigo,
      motivo: fila.motivo,
      detalle: fila.detalle,
      puntos: esFinal ? 0 : null,
      medalla: null,
      clasificado: false,
    });
  }
  return filas;
}

/** `true` si todos los carriles tienen resultado. */
export function resultadosCompletos(carriles: Carril[]): boolean {
  return carriles.every((c) => c.resultado !== undefined);
}

/** «Avanzan a la semifinal los mejores 4 tiempos de cada serie». */
export function textoAvance(avance: Avance): string {
  if (avance.cantidad === 1) return `Avanza a ${avance.destino} el mejor tiempo de cada serie`;
  return `Avanzan a ${avance.destino} los mejores ${avance.cantidad} tiempos de cada serie`;
}
