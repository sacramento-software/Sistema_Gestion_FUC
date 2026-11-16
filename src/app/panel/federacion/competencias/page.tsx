import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { ListaCompetencias, primero } from '@/components/vistas/federacion-gestion';
import { anioTemporada } from '@/dominio/fechas';

export default async function CompetenciasPage({ searchParams }: { searchParams: Promise<{ estado?: string | string[] }> }) {
  const { estado } = await searchParams;
  return (
    <>
      <EncabezadoPanel
        titulo="Competencias"
        subtitulo={`Temporada ${anioTemporada()}`}
        acciones={<AccionNoDisponible icon={Plus}>Crear competencia</AccionNoDisponible>}
      />
      <ListaCompetencias estado={primero(estado)} />
    </>
  );
}
