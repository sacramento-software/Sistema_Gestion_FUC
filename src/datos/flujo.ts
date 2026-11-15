// Flujo entre fases: quién puede estar en cada fase según los resultados de la anterior. Lo usan las
// consultas (armado de fase) y el test de integridad. No es parte de la API pública (`index.ts` no lo exporta).
import { calcularResultados, resultadosCompletos } from '@/dominio/resultados';
import { fases, series } from './competencias';
import { inscripciones } from './inscripciones';
import type { Fase, Serie } from './tipos';

export function fasesDeEvento(eventoId: string): Fase[] {
  return fases.filter((f) => f.eventoId === eventoId).sort((a, b) => a.orden - b.orden);
}

export function seriesDeFase(faseId: string): Serie[] {
  return series.filter((s) => s.faseId === faseId);
}

function porTiempo(fase: Fase) {
  const delasSeries = seriesDeFase(fase.id);
  if (delasSeries.length === 0) return null;
  if (!delasSeries.every((s) => resultadosCompletos(s.carriles))) return null;
  return delasSeries.flatMap((s) =>
    calcularResultados(s.carriles, { tipoFase: fase.tipo, avance: fase.avance }).filter((f) => f.tiempoCs !== null),
  );
}

/** Inscripciones que clasifican de la fase; `null` si todavía no tiene todas sus series terminadas. */
export function clasificadosDeFase(fase: Fase): Set<string> | null {
  const filas = porTiempo(fase);
  if (!filas) return null;
  return new Set(filas.filter((f) => f.clasificado).map((f) => f.inscripcionId));
}

/** Inscripciones que corrieron con tiempo y no clasificaron (van al repechaje); un código queda afuera. */
export function noClasificadosConTiempo(fase: Fase): Set<string> | null {
  const filas = porTiempo(fase);
  if (!filas) return null;
  return new Set(filas.filter((f) => !f.clasificado).map((f) => f.inscripcionId));
}

function unir(...conjuntos: (Set<string> | null)[]): Set<string> | null {
  if (conjuntos.some((c) => c === null)) return null;
  return new Set(conjuntos.flatMap((c) => [...(c as Set<string>)]));
}

/**
 * Inscripciones que pueden correr una fase:
 * - la primera: todas las del evento;
 * - repechaje: los no clasificados de las eliminatorias;
 * - semifinal: los clasificados de las eliminatorias y del repechaje, si lo hay;
 * - final: los de la semifinal si existe; si no, los de las eliminatorias y el repechaje.
 * `null` si depende de una fase que todavía no tiene resultados completos.
 */
export function elegiblesParaFase(fase: Fase): Set<string> | null {
  const delEvento = fasesDeEvento(fase.eventoId);
  if (delEvento[0].id === fase.id) {
    return new Set(inscripciones.filter((i) => i.eventoId === fase.eventoId).map((i) => i.id));
  }
  const de = (tipo: Fase['tipo']) => delEvento.find((f) => f.tipo === tipo);
  const eliminatoria = de('eliminatoria');
  const repechaje = de('repechaje');
  const semifinal = de('semifinal');

  if (fase.tipo === 'repechaje') return eliminatoria ? noClasificadosConTiempo(eliminatoria) : null;
  const clasifican = (f: Fase | undefined) => (f ? clasificadosDeFase(f) : new Set<string>());
  if (fase.tipo === 'semifinal') return unir(clasifican(eliminatoria), clasifican(repechaje));
  if (fase.tipo === 'final') {
    if (semifinal) return clasificadosDeFase(semifinal);
    return unir(clasifican(eliminatoria), clasifican(repechaje));
  }
  return null;
}
