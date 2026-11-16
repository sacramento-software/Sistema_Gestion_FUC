import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { BarraGestion } from '@/components/vistas/comun/BarraGestion';
import { ListaCompetencias, primero } from '@/components/vistas/federacion-gestion';
import { anioTemporada } from '@/dominio/fechas';
import { rutas } from '@/lib/rutas';

export default async function CompetenciasPage({ searchParams }: { searchParams: Promise<{ estado?: string | string[]; q?: string | string[] }> }) {
  const { estado, q } = await searchParams;
  const texto = (primero(q) ?? '').trim();
  return (
    <>
      <EncabezadoPanel
        titulo="Competencias"
        subtitulo={`Temporada ${anioTemporada()}`}
      />
      <BarraGestion
        accion={rutas.panel.federacion.competencias()}
        placeholder="Buscar competencia o sede"
        q={texto}
        conservar={{ estado: primero(estado) }}
        alta={<AccionNoDisponible icon={Plus}>Crear competencia</AccionNoDisponible>}
      />
      <ListaCompetencias estado={primero(estado)} texto={texto} />
    </>
  );
}
