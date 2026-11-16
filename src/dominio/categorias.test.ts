import { describe, expect, it } from 'vitest';
import { CATEGORIAS, categoriaEnTemporada, categoriaPorEdad } from './categorias';

describe('categoriaPorEdad', () => {
  const bordes: [number, string | null][] = [
    [8, null],
    [9, 'PRE_INFANTIL'],
    [10, 'PRE_INFANTIL'],
    [11, 'INFANTIL'],
    [12, 'INFANTIL'],
    [13, 'MENOR'],
    [14, 'MENOR'],
    [15, 'CADETE'],
    [16, 'CADETE'],
    [17, 'JUNIOR'],
    [18, 'JUNIOR'],
    [19, 'SUB_21'],
    [21, 'SUB_21'],
    [22, 'SUB_23'],
    [23, 'SUB_23'],
    [24, 'SENIOR'],
    [35, 'SENIOR'],
    [36, 'MASTER_A'],
    [40, 'MASTER_A'],
    [41, 'MASTER_B'],
    [45, 'MASTER_B'],
    [46, 'MASTER_C'],
    [80, 'MASTER_C'],
  ];
  it.each(bordes)('edad %i es %s', (edad, esperada) => {
    expect(categoriaPorEdad(edad)).toBe(esperada);
  });

  it('los rangos no se superponen ni dejan huecos desde los 9 años', () => {
    for (let edad = 9; edad <= 90; edad++) {
      expect(CATEGORIAS.filter((c) => edad >= c.desde && (c.hasta === null || edad <= c.hasta))).toHaveLength(1);
    }
  });

  it('usa los nombres visibles exactos', () => {
    expect(CATEGORIAS.map((c) => c.nombre)).toEqual([
      'Pre infantil',
      'Infantil',
      'Menor',
      'Cadete',
      'Junior',
      'Sub 21',
      'Sub 23',
      'Senior',
      'Máster A',
      'Máster B',
      'Máster C',
    ]);
  });
});

describe('categoriaEnTemporada', () => {
  it('no cambia según el día en que se mire dentro de la temporada', () => {
    expect(categoriaEnTemporada({ edad: 16 }, '2026-01-02')).toBe('CADETE');
    expect(categoriaEnTemporada({ edad: 16 }, '2026-12-31')).toBe('CADETE');
  });
  it('una menor de 16 años es Cadete, no Junior', () => {
    expect(categoriaEnTemporada({ edad: 16 }, '2026-11-15')).not.toBe('JUNIOR');
  });
});
