import { notFound } from 'next/navigation';
import { EncabezadoPanel } from '@/components/cascaras';
import { ListaSeries, PanelSerie, subtituloJuez } from '@/components/vistas/juez';
import { jornadaDeHoy, obtenerSerie, serieEnVivo } from '@/datos';
import disposicion from '@/components/vistas/juez/disposicion.module.css';

export default async function JornadaPage({ searchParams }: { searchParams: Promise<{ serie?: string | string[] }> }) {
  const { serie: parametro } = await searchParams;
  const pedida = Array.isArray(parametro) ? parametro[0] : parametro;
  const jornada = jornadaDeHoy();

  let activaId: string | undefined;
  if (pedida) {
    if (!jornada.some((s) => s.id === pedida)) notFound();
    activaId = pedida;
  } else {
    activaId = (serieEnVivo()?.id ?? jornada.find((s) => s.estado !== 'publicada')?.id) ?? jornada[0]?.id;
  }
  const serie = activaId ? obtenerSerie(activaId) : null;
  if (!serie) notFound();

  const indice = jornada.findIndex((s) => s.id === serie.id);
  return (
    <>
      <EncabezadoPanel titulo="Jornada" subtitulo={subtituloJuez()} />
      <div className={disposicion.consola}>
        <ListaSeries series={jornada} activaId={serie.id} />
        <PanelSerie serie={serie} numero={indice + 1} total={jornada.length} siguiente={jornada[indice + 1] ?? null} />
      </div>
    </>
  );
}
