import { describe, expect, it } from 'vitest';
import type { Carril } from '@/datos/tipos';
import { calcularResultados, resultadosCompletos, TABLA_PUNTOS, textoAvance } from './resultados';

const t = (numero: number, tiempoCs: number): Carril => ({ numero, inscripcionId: `b${numero}`, resultado: { tiempoCs } });
const c = (numero: number, codigo: 'DSQ' | 'DNS' | 'DNF'): Carril => ({
  numero,
  inscripcionId: `b${numero}`,
  resultado: { codigo, motivo: 'motivo' },
});

describe('calcularResultados', () => {
  it('ordena por tiempo y deja los códigos al final en el orden DNF, DSQ, DNS', () => {
    const filas = calcularResultados(
      [c(1, 'DNS'), t(2, 10300), c(3, 'DSQ'), t(4, 10100), c(5, 'DNF'), c(6, 'DSQ')],
      { tipoFase: 'eliminatoria' },
    );
    expect(filas.map((f) => f.numero)).toEqual([4, 2, 5, 3, 6, 1]);
    expect(filas.map((f) => f.posicion)).toEqual([1, 2, null, null, null, null]);
    expect(filas.slice(2).map((f) => f.codigo)).toEqual(['DNF', 'DSQ', 'DSQ', 'DNS']);
  });

  it('calcula la diferencia con el primero; el primero y los códigos no tienen', () => {
    const filas = calcularResultados([t(1, 10127), t(2, 10205), c(3, 'DSQ')], { tipoFase: 'semifinal' });
    expect(filas.map((f) => f.diferenciaCs)).toEqual([null, 78, null]);
  });

  it('da puntos solo en finales (10-8-6-5-4-3-2-1 y 0 desde el noveno o con código)', () => {
    const carriles = Array.from({ length: 9 }, (_, i) => t(i + 1, 10000 + i * 50));
    const final = calcularResultados(carriles, { tipoFase: 'final' });
    expect(final.map((f) => f.puntos)).toEqual([...TABLA_PUNTOS, 0]);

    const conCodigo = calcularResultados([t(1, 10000), c(2, 'DSQ')], { tipoFase: 'final' });
    expect(conCodigo.map((f) => f.puntos)).toEqual([10, 0]);

    for (const tipoFase of ['eliminatoria', 'repechaje', 'semifinal'] as const) {
      const filas = calcularResultados(carriles, { tipoFase });
      expect(filas.every((f) => f.puntos === null)).toBe(true);
    }
  });

  it('marca el podio solo en finales', () => {
    const carriles = [t(1, 10000), t(2, 10100), t(3, 10200), t(4, 10300)];
    const final = calcularResultados(carriles, { tipoFase: 'final' });
    expect(final.map((f) => f.medalla)).toEqual(['oro', 'plata', 'bronce', null]);
    const semi = calcularResultados(carriles, { tipoFase: 'semifinal' });
    expect(semi.every((f) => f.medalla === null)).toBe(true);
  });

  it('clasifica las primeras posiciones con tiempo y nunca un código', () => {
    const filas = calcularResultados([t(1, 10300), c(2, 'DSQ'), t(3, 10100), t(4, 10200), t(5, 10400)], {
      tipoFase: 'eliminatoria',
      avance: { cantidad: 3, destino: 'la final' },
    });
    expect(filas.filter((f) => f.clasificado).map((f) => f.numero)).toEqual([3, 4, 1]);
    expect(filas.find((f) => f.codigo)?.clasificado).toBe(false);
  });

  it('un DSQ entre los primeros no le quita el lugar a quien tiene tiempo', () => {
    // El carril 1 hubiera sido el más rápido, pero fue descalificado: avanzan los dos siguientes.
    const filas = calcularResultados([c(1, 'DSQ'), t(2, 10100), t(3, 10200), t(4, 10300)], {
      tipoFase: 'eliminatoria',
      avance: { cantidad: 2, destino: 'la final' },
    });
    expect(filas.filter((f) => f.clasificado).map((f) => f.numero)).toEqual([2, 3]);
  });

  it('con tiempos iguales comparten posición y la siguiente se saltea', () => {
    const filas = calcularResultados([t(1, 10000), t(2, 10000), t(3, 10100)], { tipoFase: 'final' });
    expect(filas.map((f) => f.posicion)).toEqual([1, 1, 3]);
  });

  it('ignora un carril sin resultado', () => {
    const filas = calcularResultados([t(1, 10000), { numero: 2, inscripcionId: 'b2' }], { tipoFase: 'final' });
    expect(filas).toHaveLength(1);
  });
});

describe('resultadosCompletos', () => {
  it('es true solo si todos tienen resultado', () => {
    expect(resultadosCompletos([t(1, 10000), c(2, 'DNS')])).toBe(true);
    expect(resultadosCompletos([t(1, 10000), { numero: 2, inscripcionId: 'b2' }])).toBe(false);
  });
});

describe('textoAvance', () => {
  it('lee el avance de la fase', () => {
    expect(textoAvance({ cantidad: 4, destino: 'la semifinal' })).toBe(
      'Avanzan a la semifinal los mejores 4 tiempos de cada serie',
    );
    expect(textoAvance({ cantidad: 1, destino: 'la final' })).toBe('Avanza a la final el mejor tiempo de cada serie');
  });
});
