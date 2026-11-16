import { notFound } from 'next/navigation';
import { EncabezadoPanel } from '@/components/cascaras';
import { CategoryTag } from '@/components/ds';
import { ListaSeries, PanelSerie, subtituloJuez } from '@/components/vistas/juez';
import { jornadaDeHoy, obtenerEvento, obtenerSerie, serieEnVivo } from '@/datos';
import { rutas } from '@/lib/rutas';
import disposicion from '@/components/vistas/juez/disposicion.module.css';
import estilos from '@/components/vistas/juez/juez.module.css';

type Parametro = string | string[] | undefined;
const primero = (p: Parametro) => (Array.isArray(p) ? p[0] : p);

export default async function JornadaPage({
  searchParams,
}: {
  searchParams: Promise<{ evento?: Parametro; serie?: Parametro }>;
}) {
  const q = await searchParams;
  const jornada = jornadaDeHoy();
  if (jornada.length === 0) notFound();

  // Eventos con series en la jornada, en el orden en que aparecen por hora.
  const eventoIds = [...new Set(jornada.map((s) => s.eventoId))];
  const eventos = eventoIds
    .map((id) => obtenerEvento(id))
    .filter((e): e is NonNullable<typeof e> => e !== null);

  // El evento sale de la serie pedida, del parámetro o, por defecto, del que tiene la serie en vivo.
  const seriePedida = primero(q.serie);
  const eventoPedido = primero(q.evento);
  let eventoId: string | undefined;
  if (seriePedida) {
    const s = jornada.find((x) => x.id === seriePedida);
    if (!s) notFound();
    eventoId = s.eventoId;
  } else if (eventoPedido) {
    if (!eventoIds.includes(eventoPedido)) notFound();
    eventoId = eventoPedido;
  } else {
    eventoId = serieEnVivo()?.eventoId ?? jornada.find((s) => s.estado !== 'publicada')?.eventoId ?? jornada[0].eventoId;
  }

  const seriesDelEvento = jornada.filter((s) => s.eventoId === eventoId);
  const activaId =
    (seriePedida && seriesDelEvento.find((s) => s.id === seriePedida)?.id) ??
    seriesDelEvento.find((s) => s.estado === 'en-vivo')?.id ??
    seriesDelEvento.find((s) => s.estado !== 'publicada')?.id ??
    seriesDelEvento[0]?.id;
  const serie = activaId ? obtenerSerie(activaId) : null;
  if (!serie) notFound();

  const indice = seriesDelEvento.findIndex((s) => s.id === serie.id);
  return (
    <>
      <EncabezadoPanel titulo="Jornada" subtitulo={subtituloJuez()} />
      <div className={estilos.pagina}>
        <nav className={`${disposicion.filaChips} ${disposicion.chipsEvento}`} aria-label="Eventos de la jornada">
          {eventos.map((e) => (
            <CategoryTag
              key={e.id}
              href={`${rutas.panel.juez.jornada()}?evento=${encodeURIComponent(e.id)}`}
              seleccionado={e.id === eventoId}
            >
              {e.lectura}
            </CategoryTag>
          ))}
        </nav>
        <div className={disposicion.consola}>
          <ListaSeries series={seriesDelEvento} activaId={serie.id} />
          <PanelSerie
            serie={serie}
            numero={indice + 1}
            total={seriesDelEvento.length}
            siguiente={seriesDelEvento[indice + 1] ?? null}
          />
        </div>
      </div>
    </>
  );
}
