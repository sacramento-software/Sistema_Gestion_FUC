import { notFound } from 'next/navigation';
import { EncabezadoPanel } from '@/components/cascaras';
import { StatusBadge } from '@/components/ds';
import { VistaInscripcion } from '@/components/vistas/delegado/Inscribir';
import { Pagina } from '@/components/vistas/delegado/Piezas';
import { eventosDeCompetencia, inscripcionesDeClub, obtenerCompetencia } from '@/datos';
import { EVENTO_D3_POR_DEFECTO } from '@/datos/extra/06-delegado';
import { requerirRol } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function InscribirEnEventoPage({
  params,
  searchParams,
}: {
  params: Promise<{ competenciaId: string }>;
  searchParams: Promise<{ evento?: string | string[] }>;
}) {
  const usuario = await requerirRol('delegado');
  const clubId = usuario.clubId ?? '';
  const { competenciaId } = await params;
  const competencia = obtenerCompetencia(competenciaId);
  if (!competencia) notFound();

  const eventos = eventosDeCompetencia(competencia.id);
  if (eventos.length === 0) notFound();
  const { evento: parametro } = await searchParams;
  const pedido = Array.isArray(parametro) ? parametro[0] : parametro;
  const evento =
    eventos.find((e) => e.id === pedido) ??
    eventos.find((e) => e.id === EVENTO_D3_POR_DEFECTO) ??
    eventos[0];

  const inscripcionesPorEvento = new Map(
    inscripcionesDeClub(clubId, competencia.id).map((g) => [g.evento.id, g.botes.length] as const),
  );

  return (
    <>
      <EncabezadoPanel
        titulo={competencia.nombre}
        subtitulo={`Inscribir en un evento · ${competencia.sede} · ${competencia.fechas.media}`}
        acciones={
          <>
            <StatusBadge estado={competencia.estado} />
            {competencia.estado === 'abiertas' && competencia.cierre && <span>{competencia.cierre.texto}</span>}
          </>
        }
      />
      <Pagina>
        <VistaInscripcion
          competencia={competencia}
          eventos={eventos}
          evento={evento}
          clubId={clubId}
          inscripcionesPorEvento={inscripcionesPorEvento}
        />
      </Pagina>
    </>
  );
}
