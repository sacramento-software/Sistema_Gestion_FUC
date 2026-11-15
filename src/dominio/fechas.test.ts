import { describe, expect, it } from 'vitest';
import {
  anioTemporada,
  diasEntre,
  fechaRelativa,
  formatearFecha,
  formatearHora,
  formatearRango,
  hoyISO,
  sumarDias,
  sumarMinutos,
  textoCierre,
} from './fechas';

const HOY = '2026-11-15'; // domingo

describe('hoyISO', () => {
  it('usa la fecha civil de Montevideo, no la del servidor (UTC)', () => {
    // 01:30 UTC del 16 es todavía el 15 a las 22:30 en Montevideo (UTC-3).
    expect(hoyISO(new Date('2026-11-16T01:30:00Z'))).toBe('2026-11-15');
    // 03:30 UTC del 16 ya es el 16 a las 00:30 en Montevideo.
    expect(hoyISO(new Date('2026-11-16T03:30:00Z'))).toBe('2026-11-16');
  });
});

describe('aritmética de fechas', () => {
  it('suma y resta días', () => {
    expect(sumarDias(HOY, 3)).toBe('2026-11-18');
    expect(sumarDias(HOY, -40)).toBe('2026-10-06');
    expect(fechaRelativa(1, HOY)).toBe('2026-11-16');
  });

  it('cruza el fin de año', () => {
    expect(sumarDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(fechaRelativa(0, '2026-12-31')).toBe('2026-12-31');
    expect(fechaRelativa(1, '2026-12-31')).toBe('2027-01-01');
  });

  it('cuenta días entre fechas', () => {
    expect(diasEntre(HOY, '2026-11-18')).toBe(3);
    expect(diasEntre('2026-11-18', HOY)).toBe(-3);
    expect(diasEntre('2026-12-31', '2027-01-01')).toBe(1);
  });

  it('la temporada es el año de hoy', () => {
    expect(anioTemporada(HOY)).toBe(2026);
    expect(anioTemporada('2027-01-01')).toBe(2027);
  });
});

describe('formatearFecha', () => {
  it('formatea en español de Uruguay', () => {
    expect(formatearFecha(HOY, 'larga')).toBe('domingo 15 de noviembre de 2026');
    expect(formatearFecha(HOY, 'dia')).toBe('Domingo 15 de noviembre');
    expect(formatearFecha(HOY, 'dia-corto')).toBe('Dom 15');
    expect(formatearFecha(HOY, 'media')).toBe('15 nov 2026');
    expect(formatearFecha(HOY, 'mes-anio')).toBe('nov 2026');
  });

  it('con el cruce de año', () => {
    expect(formatearFecha('2027-01-01', 'larga')).toBe('viernes 1 de enero de 2027');
    expect(formatearFecha('2027-01-01', 'dia-corto')).toBe('Vie 1');
  });
});

describe('formatearRango', () => {
  it('mismo mes', () => {
    expect(formatearRango(HOY, '2026-11-16', 'larga')).toBe('15 y 16 de noviembre de 2026');
    expect(formatearRango(HOY, '2026-11-16', 'media')).toBe('15 y 16 nov 2026');
    expect(formatearRango(HOY, '2026-11-16', 'corta')).toBe('15 y 16 nov');
  });

  it('cambia el mes', () => {
    expect(formatearRango('2026-11-30', '2026-12-01', 'media')).toBe('30 nov y 1 dic 2026');
    expect(formatearRango('2026-11-30', '2026-12-01', 'corta')).toBe('30 nov y 1 dic');
    expect(formatearRango('2026-11-30', '2026-12-01', 'larga')).toBe('30 de noviembre y 1 de diciembre de 2026');
  });

  it('cambia el año', () => {
    expect(formatearRango('2026-12-31', '2027-01-01', 'media')).toBe('31 dic 2026 y 1 ene 2027');
  });

  it('un solo día', () => {
    expect(formatearRango(HOY, HOY, 'media')).toBe('15 nov 2026');
    expect(formatearRango(HOY, HOY, 'corta')).toBe('15 nov');
  });

  it('más de dos días usa «al»', () => {
    expect(formatearRango(HOY, '2026-11-17', 'corta')).toBe('15 al 17 nov');
  });
});

describe('formatearHora y sumarMinutos', () => {
  it('agrega la h', () => {
    expect(formatearHora('10:40')).toBe('10:40 h');
  });
  it('suma minutos', () => {
    expect(sumarMinutos('10:40', 1)).toBe('10:41');
    expect(sumarMinutos('09:59', 2)).toBe('10:01');
  });
});

describe('textoCierre', () => {
  it('con días de anticipación', () => {
    expect(textoCierre('2026-11-18', '23:59', HOY)).toBe('Cierra en 3 días · 18 de noviembre, 23:59');
  });
  it('mañana', () => {
    expect(textoCierre('2026-11-16', '23:59', HOY)).toBe('Cierra mañana · 16 de noviembre, 23:59');
  });
  it('hoy', () => {
    expect(textoCierre(HOY, '23:59', HOY)).toBe('Cierra hoy · 23:59');
  });
  it('ya pasó', () => {
    expect(textoCierre('2026-11-14', '23:59', HOY)).toBe('Cerró el 14 de noviembre');
  });
  it('con el cruce de año', () => {
    expect(textoCierre('2027-01-02', '23:59', '2026-12-31')).toBe('Cierra en 2 días · 2 de enero, 23:59');
  });
});
