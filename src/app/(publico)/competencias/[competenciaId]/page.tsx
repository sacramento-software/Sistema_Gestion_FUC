import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PaginaCompetencia, type Pestana } from '@/components/vistas/regata/PaginaCompetencia';
import { obtenerCompetencia } from '@/datos';

interface Props {
  params: Promise<{ competenciaId: string }>;
  searchParams: Promise<{ pestana?: string | string[]; categoria?: string | string[] }>;
}

const primero = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competenciaId } = await params;
  const competencia = obtenerCompetencia(competenciaId);
  return { title: competencia?.nombre ?? 'Competencia' };
}

export default async function CompetenciaPage({ params, searchParams }: Props) {
  const { competenciaId } = await params;
  const consulta = await searchParams;
  const competencia = obtenerCompetencia(competenciaId);
  if (!competencia) notFound();

  const pestana: Pestana = primero(consulta.pestana) === 'resultados' ? 'resultados' : 'programa';
  return <PaginaCompetencia competencia={competencia} pestana={pestana} categoria={primero(consulta.categoria)} />;
}
