// Cálculos de contabilidad y estadísticas a partir de los datos de la demo. Nada de esto se escribe a mano.
import {
  eventosDeCompetencia,
  inscripcionesDeClub,
  inscripcionesDeEvento,
  listarClubes,
  listarCompetencias,
  listarDeportistas,
  seriesPublicadas,
} from '@/datos';
import { CATEGORIAS } from '@/dominio';

/** Botes inscriptos por competencia (todas las de la temporada). */
export function botesPorCompetencia(): { id: string; nombre: string; botes: number }[] {
  return listarCompetencias().map((c) => ({ id: c.id, nombre: c.nombre, botes: c.botesInscriptos }));
}

export function totalBotes(): number {
  return botesPorCompetencia().reduce((n, c) => n + c.botes, 0);
}

/** Botes inscriptos por club en la temporada, de mayor a menor. */
export function botesPorClub(): { nombre: string; botes: number }[] {
  return listarClubes()
    .map((club) => ({
      nombre: club.nombre,
      botes: inscripcionesDeClub(club.id).reduce((n, g) => n + g.botes.length, 0),
    }))
    .sort((a, b) => b.botes - a.botes || a.nombre.localeCompare(b.nombre, 'es'));
}

/** Deportistas distintos que compitieron (figuran en algún bote inscripto), por categoría, en el orden de la tabla. */
export function participacionPorCategoria(): { nombre: string; deportistas: number }[] {
  const porCategoria = new Map<string, Set<string>>();
  for (const competencia of listarCompetencias()) {
    for (const evento of eventosDeCompetencia(competencia.id)) {
      for (const bote of inscripcionesDeEvento(evento.id)) {
        for (const d of bote.deportistas) {
          const ids = porCategoria.get(d.categoriaTexto) ?? new Set<string>();
          ids.add(d.id);
          porCategoria.set(d.categoriaTexto, ids);
        }
      }
    }
  }
  return CATEGORIAS.map((c) => ({ nombre: c.nombre, deportistas: porCategoria.get(c.nombre)?.size ?? 0 }));
}

export function deportistasPorSexo(): { femenino: number; masculino: number } {
  return {
    femenino: listarDeportistas({ sexo: 'F' }).length,
    masculino: listarDeportistas({ sexo: 'M' }).length,
  };
}

export function seriesCorridas(): number {
  return listarCompetencias().reduce((n, c) => n + seriesPublicadas(c.id).length, 0);
}
