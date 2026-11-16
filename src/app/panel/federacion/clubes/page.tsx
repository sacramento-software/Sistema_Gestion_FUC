import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { BarraGestion } from '@/components/vistas/comun/BarraGestion';
import { DetalleClub, ListaClubes } from '@/components/vistas/federacion-resto/ClubesVista';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { listarClubes, obtenerClub } from '@/datos';
import { sinTildes } from '@/datos/texto';
import { rutas } from '@/lib/rutas';

const CLUB_POR_DEFECTO = 'acal-nautico-club';

const primero = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ClubesPage({
  searchParams,
}: {
  searchParams: Promise<{ club?: string | string[]; plantel?: string | string[]; q?: string | string[] }>;
}) {
  const params = await searchParams;
  const todos = listarClubes();
  const q = (primero(params.q) ?? '').trim();
  const clubes = q
    ? todos.filter((c) => sinTildes(`${c.nombre} ${c.sigla} ${c.departamento ?? ''}`).includes(sinTildes(q)))
    : todos;
  const club = obtenerClub(primero(params.club) ?? CLUB_POR_DEFECTO);
  if (!club) notFound();

  return (
    <>
      <EncabezadoPanel
        titulo="Clubes y delegados"
        subtitulo={`${todos.length} clubes afiliados`}
      />
      <BarraGestion
        accion={rutas.panel.federacion.clubes()}
        placeholder="Buscar club"
        q={q}
        conservar={{ club: club.id, plantel: primero(params.plantel) === '1' ? '1' : undefined }}
        alta={<AccionNoDisponible icon={Plus}>Agregar club</AccionNoDisponible>}
      />
      <div className={estilos.dosColumnas}>
        <ListaClubes clubes={clubes} activoId={club.id} />
        <DetalleClub club={club} plantel={primero(params.plantel) === '1'} />
      </div>
    </>
  );
}
