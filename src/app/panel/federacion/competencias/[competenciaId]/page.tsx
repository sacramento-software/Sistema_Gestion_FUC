import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EncabezadoPanel } from '@/components/cascaras';
import { CentroCompetencia, PESTANAS, primero, type IdPestana } from '@/components/vistas/federacion-gestion';
import { obtenerCompetencia } from '@/datos';
import { rutas } from '@/lib/rutas';

interface Props {
  params: Promise<{ competenciaId: string }>;
  searchParams: Promise<{ pestana?: string | string[]; club?: string | string[] }>;
}

export default async function CompetenciaGestionPage({ params, searchParams }: Props) {
  const { competenciaId } = await params;
  const consulta = await searchParams;
  const competencia = obtenerCompetencia(competenciaId);
  if (!competencia) notFound();

  const pedida = primero(consulta.pestana);
  const pestana: IdPestana = PESTANAS.find((p) => p.id === pedida)?.id ?? 'programa';

  return (
    <>
      <EncabezadoPanel
        titulo={competencia.nombre}
        subtitulo={`${competencia.sede} · ${competencia.fechas.larga}`}
        acciones={<Link href={rutas.competencia(competencia.id)} style={{ fontWeight: 600, textUnderlineOffset: 4 }}>Ver en el sitio público</Link>}
      />
      <CentroCompetencia competencia={competencia} pestana={pestana} club={primero(consulta.club)} />
    </>
  );
}
