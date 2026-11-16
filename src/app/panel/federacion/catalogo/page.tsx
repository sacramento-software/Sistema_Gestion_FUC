import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { Catalogo, primero, resumenCatalogo } from '@/components/vistas/federacion-gestion';

type Param = string | string[] | undefined;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ embarcacion?: Param; categoria?: Param; genero?: Param; inactivos?: Param }>;
}) {
  const consulta = await searchParams;
  return (
    <>
      <EncabezadoPanel
        titulo="Catálogo de eventos"
        subtitulo={resumenCatalogo()}
        acciones={<AccionNoDisponible icon={Plus}>Crear evento</AccionNoDisponible>}
      />
      <Catalogo
        filtros={{
          embarcacion: primero(consulta.embarcacion),
          categoria: primero(consulta.categoria),
          genero: primero(consulta.genero),
          inactivos: primero(consulta.inactivos),
        }}
      />
    </>
  );
}
