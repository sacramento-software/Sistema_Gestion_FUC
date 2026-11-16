import { notFound } from 'next/navigation';
import { EncabezadoPanel } from '@/components/cascaras';
import { ArmadoVista, subtituloJuez } from '@/components/vistas/juez';
import { armadoDeFase, competenciaEnCurso, eventosDeCompetencia } from '@/datos';

const EVENTO_POR_DEFECTO = 'vel-k2-500-junior-f';

type Parametro = string | string[] | undefined;
const primero = (p: Parametro) => (Array.isArray(p) ? p[0] : p);

export default async function ArmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ evento?: Parametro; fase?: Parametro; serie?: Parametro }>;
}) {
  const q = await searchParams;
  const competencia = competenciaEnCurso();
  if (!competencia) notFound();
  const eventos = eventosDeCompetencia(competencia.id);

  const pedido = primero(q.evento);
  const evento = pedido
    ? eventos.find((e) => e.id === pedido)
    : (eventos.find((e) => e.id === EVENTO_POR_DEFECTO) ?? eventos[0]);
  if (!evento) notFound();

  const faseId = primero(q.fase);
  const fase = (faseId && evento.fases.find((f) => f.id === faseId)) || evento.fases[0];
  if (!fase) notFound();

  const armado = armadoDeFase(fase.id);
  if (!armado) notFound();

  const serieId = primero(q.serie);
  const serie = armado.series.find((s) => s.id === serieId) ?? armado.series[0] ?? null;

  return (
    <>
      <EncabezadoPanel titulo="Armado de series" subtitulo={subtituloJuez()} />
      <ArmadoVista eventos={eventos} armado={armado} serie={serie} />
    </>
  );
}
