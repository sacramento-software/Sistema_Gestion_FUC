import { describe, expect, it } from 'vitest';
import { avisosParaEvento, nombreBote, nombreCortoBote } from './botes';
import { estadoFicha, TEXTO_FICHA } from './ficha-medica';

const mar = { nombre: 'Martín', apellido: 'Rodríguez' };
const val = { nombre: 'Valentina', apellido: 'Ríos' };
const cam = { nombre: 'Camila', apellido: 'Suárez' };
const ana = { nombre: 'Ana', apellido: 'Gómez' };
const bru = { nombre: 'Bruno', apellido: 'Correa' };

describe('nombreBote', () => {
  it('K1 es el nombre completo', () => {
    expect(nombreBote([mar])).toBe('Martín Rodríguez');
  });
  it('K2 une con «y»', () => {
    expect(nombreBote([val, cam])).toBe('Valentina Ríos y Camila Suárez');
  });
  it('K4 separa con comas y cierra con «y»', () => {
    expect(nombreBote([mar, val, cam, ana])).toBe('Martín Rodríguez, Valentina Ríos, Camila Suárez y Ana Gómez');
  });
});

describe('nombreCortoBote', () => {
  it('K1 es el nombre completo y los demás, los apellidos con barra', () => {
    expect(nombreCortoBote([mar])).toBe('Martín Rodríguez');
    expect(nombreCortoBote([val, cam])).toBe('Ríos / Suárez');
    expect(nombreCortoBote([mar, val, cam, bru])).toBe('Rodríguez / Ríos / Suárez / Correa');
  });
});

describe('estadoFicha', () => {
  it('distingue vigente, vencida y en trámite', () => {
    expect(estadoFicha({ venceEnDias: 90 })).toBe('vigente');
    expect(estadoFicha({ venceEnDias: 0 })).toBe('vigente');
    expect(estadoFicha({ venceEnDias: -1 })).toBe('vencida');
    expect(estadoFicha({ enTramite: true })).toBe('en-tramite');
  });
  it('tiene los textos visibles', () => {
    expect(TEXTO_FICHA).toEqual({ vigente: 'Vigente', vencida: 'Vencida', 'en-tramite': 'En trámite' });
  });
});

describe('avisosParaEvento', () => {
  const eventoJuniorF = { categoriaId: 'JUNIOR', genero: 'F' } as const;
  const vigente = { venceEnDias: 100 };

  it('sin avisos cuando todo coincide', () => {
    expect(avisosParaEvento({ edad: 17, sexo: 'F', fichaMedica: vigente }, eventoJuniorF)).toEqual([]);
  });

  it('ficha vencida', () => {
    const avisos = avisosParaEvento({ edad: 17, sexo: 'F', fichaMedica: { venceEnDias: -5 } }, eventoJuniorF);
    expect(avisos).toEqual([{ tipo: 'ficha-vencida', texto: 'Ficha médica vencida.' }]);
  });

  it('una ficha en trámite no avisa', () => {
    expect(avisosParaEvento({ edad: 17, sexo: 'F', fichaMedica: { enTramite: true } }, eventoJuniorF)).toEqual([]);
  });

  it('categoría distinta', () => {
    const avisos = avisosParaEvento({ edad: 16, sexo: 'F', fichaMedica: vigente }, eventoJuniorF);
    expect(avisos).toEqual([{ tipo: 'categoria-distinta', texto: 'Categoría Cadete; el evento es Junior.' }]);
  });

  it('sexo distinto', () => {
    const avisos = avisosParaEvento({ edad: 17, sexo: 'M', fichaMedica: vigente }, eventoJuniorF);
    expect(avisos).toEqual([{ tipo: 'sexo-distinto', texto: 'Sexo distinto al del evento.' }]);
  });

  it('combina los tres avisos, en ese orden', () => {
    const avisos = avisosParaEvento({ edad: 16, sexo: 'M', fichaMedica: { venceEnDias: -1 } }, eventoJuniorF);
    expect(avisos.map((a) => a.tipo)).toEqual(['ficha-vencida', 'categoria-distinta', 'sexo-distinto']);
  });

  it('un evento mixto no avisa por sexo', () => {
    const avisos = avisosParaEvento({ edad: 17, sexo: 'M', fichaMedica: vigente }, { categoriaId: 'JUNIOR', genero: 'X' });
    expect(avisos).toEqual([]);
  });
});
