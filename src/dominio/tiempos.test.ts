import { describe, expect, it } from 'vitest';
import { formatearDiferencia, formatearTiempo, leyendaCodigos, parsearTiempo } from './tiempos';

describe('formatearTiempo', () => {
  it('desde el minuto usa m:ss.cc', () => {
    expect(formatearTiempo(10127)).toBe('1:41.27');
    expect(formatearTiempo(136135)).toBe('22:41.35');
  });

  it('por debajo del minuto no lleva «0:»', () => {
    expect(formatearTiempo(3892)).toBe('38.92');
    expect(formatearTiempo(530)).toBe('5.30');
  });

  it('bordes: 59.99, 1:00.00, 9:59.99, 10:00.00', () => {
    expect(formatearTiempo(5999)).toBe('59.99');
    expect(formatearTiempo(6000)).toBe('1:00.00');
    expect(formatearTiempo(59999)).toBe('9:59.99');
    expect(formatearTiempo(60000)).toBe('10:00.00');
  });

  it('completa con ceros los segundos y las centésimas', () => {
    expect(formatearTiempo(6505)).toBe('1:05.05');
  });
});

describe('formatearDiferencia', () => {
  it('antepone +', () => {
    expect(formatearDiferencia(78)).toBe('+0.78');
    expect(formatearDiferencia(6210)).toBe('+1:02.10');
  });
  it('cero o negativa devuelve null', () => {
    expect(formatearDiferencia(0)).toBeNull();
    expect(formatearDiferencia(-12)).toBeNull();
  });
});

describe('parsearTiempo', () => {
  it('es la inversa de formatearTiempo', () => {
    for (const cs of [3892, 5999, 6000, 10127, 59999, 60000, 136135]) {
      expect(parsearTiempo(formatearTiempo(cs))).toBe(cs);
    }
  });
  it('rechaza un formato inválido', () => {
    expect(() => parsearTiempo('1:5.30')).toThrow();
  });
});

describe('leyendaCodigos', () => {
  it('une los significados con un punto medio', () => {
    expect(leyendaCodigos(['DNS', 'DSQ'])).toBe('DSQ: descalificado · DNS: no largó');
    expect(leyendaCodigos(['DNF'])).toBe('DNF: no terminó');
    expect(leyendaCodigos([])).toBe('');
  });
  it('no repite un código', () => {
    expect(leyendaCodigos(['DSQ', 'DSQ'])).toBe('DSQ: descalificado');
  });
});
