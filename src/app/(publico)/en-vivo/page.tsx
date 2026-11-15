import { redirect } from 'next/navigation';
import { competenciaEnCurso, serieEnVivo } from '@/datos';
import { rutas } from '@/lib/rutas';

export const metadata = { title: 'En vivo' };

/** Lleva a la serie que está en carrera; si no hay, a la competencia en curso; si tampoco, al calendario. */
export default function EnVivoPage() {
  const serie = serieEnVivo();
  if (serie) redirect(rutas.serie(serie.competenciaId, serie.id));
  const competencia = competenciaEnCurso();
  if (competencia) redirect(rutas.competencia(competencia.id));
  redirect(rutas.competencias());
}
