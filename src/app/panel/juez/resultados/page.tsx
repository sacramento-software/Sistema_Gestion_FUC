import { EncabezadoPanel } from '@/components/cascaras';
import { ListaResultados, subtituloJuez } from '@/components/vistas/juez';
import { jornadaDeHoy, obtenerSerie, type SerieDetalle } from '@/datos';

export default function ResultadosPage() {
  const series = jornadaDeHoy()
    .filter((s) => s.estado === 'terminada' || s.estado === 'publicada')
    .map((s) => obtenerSerie(s.id))
    .filter((s): s is SerieDetalle => s !== null);
  return (
    <>
      <EncabezadoPanel titulo="Resultados" subtitulo={subtituloJuez()} />
      <ListaResultados series={series} />
    </>
  );
}
