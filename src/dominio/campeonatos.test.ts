import { describe, expect, it } from 'vitest';
import { NOMBRE_CAMPEONATO, tablaClubes, tablaDeportistas, type FinalParaTabla } from './campeonatos';

const p = (id: string) => ({ id, nombre: id });
const club = (id: string) => ({ id, nombre: id });

// Final de K1 senior masculino: ana-club gana, gana también la segunda.
const k1: FinalParaTabla = {
  categoriaId: 'SENIOR',
  genero: 'M',
  filas: [
    { deportistas: [p('beto')], club: club('norte'), posicion: 1, puntos: 10 },
    { deportistas: [p('carlos')], club: club('sur'), posicion: 2, puntos: 8 },
    { deportistas: [p('dario')], club: club('norte'), posicion: 3, puntos: 6 },
    { deportistas: [p('esteban')], club: club('sur'), posicion: null, puntos: 0 },
  ],
};

// Final de K2 senior masculino: cada integrante suma los puntos del bote; el club, una vez.
const k2: FinalParaTabla = {
  categoriaId: 'SENIOR',
  genero: 'M',
  filas: [
    { deportistas: [p('beto'), p('dario')], club: club('norte'), posicion: 1, puntos: 10 },
    { deportistas: [p('carlos'), p('esteban')], club: club('sur'), posicion: 2, puntos: 8 },
  ],
};

const f1: FinalParaTabla = {
  categoriaId: 'JUNIOR',
  genero: 'F',
  filas: [{ deportistas: [p('zoe')], club: club('norte'), posicion: 1, puntos: 10 }],
};

describe('tablaDeportistas', () => {
  it('suma los puntos de cada final y cuenta finales y primeros puestos', () => {
    const [grupo] = tablaDeportistas([k1, k2]);
    const beto = grupo.filas.find((f) => f.id === 'beto');
    expect(beto).toMatchObject({ puntos: 20, finales: 2, primeros: 2, posicion: 1 });
  });

  it('en K2 cada integrante suma los puntos del bote', () => {
    const [grupo] = tablaDeportistas([k2]);
    expect(grupo.filas.find((f) => f.id === 'dario')?.puntos).toBe(10);
    expect(grupo.filas.find((f) => f.id === 'esteban')?.puntos).toBe(8);
  });

  it('empate de puntos: comparten posición y se ordena por primeros y alfabético', () => {
    const [grupo] = tablaDeportistas([k2]);
    expect(grupo.filas.map((f) => [f.id, f.posicion])).toEqual([
      ['beto', 1],
      ['dario', 1],
      ['carlos', 3],
      ['esteban', 3],
    ]);
  });

  it('un empate de puntos se desempata por más primeros puestos antes que por orden alfabético', () => {
    const final1: FinalParaTabla = {
      categoriaId: 'SENIOR',
      genero: 'M',
      filas: [
        { deportistas: [p('zeta')], club: club('a'), posicion: 1, puntos: 10 },
        { deportistas: [p('alfa')], club: club('b'), posicion: 2, puntos: 8 },
      ],
    };
    const final2: FinalParaTabla = {
      categoriaId: 'SENIOR',
      genero: 'M',
      filas: [
        { deportistas: [p('alfa')], club: club('b'), posicion: 3, puntos: 6 },
        { deportistas: [p('zeta')], club: club('a'), posicion: 4, puntos: 5 },
      ],
    };
    // zeta: 15 (1 primero); alfa: 14.
    const [grupo] = tablaDeportistas([final1, final2]);
    expect(grupo.filas.map((f) => f.id)).toEqual(['zeta', 'alfa']);
  });

  it('agrupa por categoría y género del evento', () => {
    const grupos = tablaDeportistas([f1, k1]);
    expect(grupos.map((g) => `${g.categoriaId}-${g.genero}`)).toEqual(['JUNIOR-F', 'SENIOR-M']);
  });
});

describe('tablaClubes', () => {
  it('el bote de K2 suma una sola vez para el club', () => {
    const filas = tablaClubes([k2]);
    expect(filas.find((f) => f.id === 'norte')).toMatchObject({ puntos: 10, finales: 1, primeros: 1 });
    expect(filas.find((f) => f.id === 'sur')?.puntos).toBe(8);
  });

  it('acumula varias finales y ordena por puntos', () => {
    const filas = tablaClubes([k1, k2]);
    expect(filas.map((f) => [f.id, f.puntos, f.posicion])).toEqual([
      ['norte', 26, 1],
      ['sur', 16, 2],
    ]);
    // «norte» tiene dos botes en la primera final y uno en la segunda: son dos finales, no tres.
    expect(filas[0].finales).toBe(2);
  });
});

describe('NOMBRE_CAMPEONATO', () => {
  it('tiene los nombres visibles', () => {
    expect(NOMBRE_CAMPEONATO['short-race']).toBe('Short Race');
    expect(NOMBRE_CAMPEONATO.promocional).toBe('Promocional (Ranking Menores)');
  });
});
