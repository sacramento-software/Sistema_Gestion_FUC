import { describe, expect, it } from 'vitest';
import {
  categoriaGenero,
  codigoEvento,
  filtroCategoria,
  lecturaEvento,
  parsearCodigoEvento,
  textoGenero,
  TRIPULANTES,
} from './eventos';

const evento = { embarcacion: 'K2', distancia: 500, categoriaId: 'JUNIOR', genero: 'F' } as const;

describe('eventos', () => {
  it('arma el código con la categoría tal como su id', () => {
    expect(codigoEvento(evento)).toBe('K2-500-JUNIOR-F');
    expect(codigoEvento({ embarcacion: 'K1', distancia: 200, categoriaId: 'SUB_23', genero: 'F' })).toBe(
      'K1-200-SUB_23-F',
    );
    expect(codigoEvento({ embarcacion: 'K1', distancia: 500, categoriaId: 'MASTER_A', genero: 'M' })).toBe(
      'K1-500-MASTER_A-M',
    );
  });

  it('se lee en español', () => {
    expect(lecturaEvento(evento)).toBe('K2 500 m · Junior · Femenino');
    expect(lecturaEvento({ embarcacion: 'K1', distancia: 500, categoriaId: 'MASTER_A', genero: 'M' })).toBe(
      'K1 500 m · Máster A · Masculino',
    );
    expect(categoriaGenero(evento)).toBe('Junior · Femenino');
  });

  it('traduce el género', () => {
    expect(textoGenero('F')).toBe('Femenino');
    expect(textoGenero('M')).toBe('Masculino');
    expect(textoGenero('X')).toBe('Mixto');
  });

  it('arma el slug del filtro', () => {
    expect(filtroCategoria(evento)).toBe('junior-f');
    expect(filtroCategoria({ categoriaId: 'MASTER_A', genero: 'M' })).toBe('master-a-m');
  });

  it('el código se puede volver a leer', () => {
    expect(parsearCodigoEvento('K2-500-JUNIOR-F')).toEqual(evento);
    expect(parsearCodigoEvento('K1-200-SUB_23-F').categoriaId).toBe('SUB_23');
  });

  it('define los tripulantes de cada embarcación', () => {
    expect(TRIPULANTES).toEqual({ K1: 1, C1: 1, K2: 2, C2: 2, K4: 4 });
  });
});
