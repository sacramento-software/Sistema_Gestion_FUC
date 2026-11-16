import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PaginaSerie } from '@/components/vistas/regata/PaginaSerie';
import { fichaDeportista, obtenerSerie } from '@/datos';

interface Props {
  params: Promise<{ competenciaId: string; serieId: string }>;
  searchParams: Promise<{ deportista?: string | string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serieId } = await params;
  const serie = obtenerSerie(serieId);
  return { title: serie ? `${serie.titulo} · ${serie.categoriaGenero}` : 'Serie' };
}

export default async function SeriePage({ params, searchParams }: Props) {
  const { competenciaId, serieId } = await params;
  const consulta = await searchParams;
  const serie = obtenerSerie(serieId);
  if (!serie || serie.competenciaId !== competenciaId) notFound();

  const idFicha = Array.isArray(consulta.deportista) ? consulta.deportista[0] : consulta.deportista;
  const ficha = idFicha ? fichaDeportista(idFicha) : null;
  return <PaginaSerie serie={serie} ficha={ficha} />;
}
