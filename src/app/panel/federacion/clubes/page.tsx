import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { DetalleClub, ListaClubes } from '@/components/vistas/federacion-resto/ClubesVista';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { listarClubes, obtenerClub } from '@/datos';

const CLUB_POR_DEFECTO = 'acal-nautico-club';

const primero = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ClubesPage({
  searchParams,
}: {
  searchParams: Promise<{ club?: string | string[]; plantel?: string | string[] }>;
}) {
  const params = await searchParams;
  const clubes = listarClubes();
  const club = obtenerClub(primero(params.club) ?? CLUB_POR_DEFECTO);
  if (!club) notFound();

  return (
    <>
      <EncabezadoPanel
        titulo="Clubes y delegados"
        subtitulo={`${clubes.length} clubes afiliados`}
        acciones={<AccionNoDisponible icon={Plus}>Agregar club</AccionNoDisponible>}
      />
      <div className={estilos.dosColumnas}>
        <ListaClubes clubes={clubes} activoId={club.id} />
        <DetalleClub club={club} plantel={primero(params.plantel) === '1'} />
      </div>
    </>
  );
}
