import { EncabezadoPanel } from '@/components/cascaras';
import { Catalogo, primero, resumenCatalogo } from '@/components/vistas/federacion-gestion';

type Param = string | string[] | undefined;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ embarcacion?: Param; categoria?: Param; genero?: Param; inactivos?: Param; q?: Param }>;
}) {
  const consulta = await searchParams;
  return (
    <>
      <EncabezadoPanel
        titulo="Catálogo de eventos"
        subtitulo={resumenCatalogo()}
      />
      <Catalogo
        filtros={{
          embarcacion: primero(consulta.embarcacion),
          categoria: primero(consulta.categoria),
          genero: primero(consulta.genero),
          inactivos: primero(consulta.inactivos),
          q: primero(consulta.q)?.trim() || undefined,
        }}
      />
    </>
  );
}
