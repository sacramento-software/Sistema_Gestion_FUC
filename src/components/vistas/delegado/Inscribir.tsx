import Link from 'next/link';
import { Check, ChevronRight, TriangleAlert } from 'lucide-react';
import { Icon, Toast } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import {
  avisosDeInscripcion,
  inscripcionesDeEvento,
  listarDeportistas,
  type BoteVista,
  type CompetenciaVista,
  type DeportistaVista,
  type EventoVista,
} from '@/datos';
import { BORRADOR_D3 } from '@/datos/extra/06-delegado';
import { TRIPULANTES } from '@/dominio/eventos';
import { rutas } from '@/lib/rutas';
import { ChipFicha, Etiqueta, Tarjeta, textoBotes } from './Piezas';
import estilos from './delegado.module.css';

const textoSexo = (sexo: 'F' | 'M') => (sexo === 'F' ? 'Femenino' : 'Masculino');

function textoInscripciones(n: number): string {
  if (n === 0) return 'Sin inscripciones del club';
  return n === 1 ? '1 inscripción del club' : `${n} inscripciones del club`;
}

/** Lista «Eventos»: columna en escritorio, lista acotada y desplazable en el celular. */
function ListaEventos({
  competencia,
  eventos,
  elegidoId,
  inscripcionesPorEvento,
}: {
  competencia: CompetenciaVista;
  eventos: EventoVista[];
  elegidoId: string;
  inscripcionesPorEvento: Map<string, number>;
}) {
  return (
    <Tarjeta
      etiquetaAria="Eventos"
      titulo="Eventos"
      meta={eventos.length === 1 ? '1 evento' : `${eventos.length} eventos`}
    >
      <ul className={`${estilos.eventos} ${estilos.listaEventosScroll}`}>
        {eventos.map((e) => {
          const activo = e.id === elegidoId;
          return (
            <li key={e.id}>
              <Link
                href={`${rutas.panel.delegado.competencia(competencia.id)}?evento=${encodeURIComponent(e.id)}`}
                aria-current={activo ? 'true' : undefined}
                className={`${estilos.eventoLink} ${activo ? estilos.eventoActivo : ''}`}
              >
                <span className={estilos.eventoFila}>
                  <span>{e.lectura}</span>
                  {activo && <Icon icono={ChevronRight} size={18} />}
                </span>
                <span className={estilos.subtexto} style={{ fontWeight: 400 }}>
                  {textoInscripciones(inscripcionesPorEvento.get(e.id) ?? 0)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Tarjeta>
  );
}

function FilaDeportista({
  deportista,
  evento,
  enBote,
  inscripto,
}: {
  deportista: DeportistaVista;
  evento: EventoVista;
  enBote: boolean;
  inscripto: boolean;
}) {
  const distinta = deportista.categoriaId !== evento.categoriaId;
  const femenino = deportista.sexo === 'F';
  return (
    <li className={estilos.itemLista}>
      <div className={estilos.itemTextos}>
        <span className={`${estilos.nombre} ${inscripto ? estilos.apagado : ''}`}>{deportista.nombreCompleto}</span>
        <span className={estilos.celdaMeta}>
          <span>
            {deportista.categoriaTexto} · {deportista.sexoTexto}
          </span>
          {distinta && (
            <span className={estilos.iconoCategoria} role="img" aria-label="Categoría distinta a la del evento">
              <Icon icono={TriangleAlert} size={16} />
            </span>
          )}
          <ChipFicha ficha={deportista.ficha} />
        </span>
      </div>
      {enBote ? (
        <Etiqueta>En el bote</Etiqueta>
      ) : inscripto ? (
        <span className={estilos.subtexto}>{femenino ? 'Ya inscripta' : 'Ya inscripto'}</span>
      ) : (
        <AccionNoDisponible variant="secundario" size="sm">
          Agregar
        </AccionNoDisponible>
      )}
    </li>
  );
}

function DeportistasDisponibles({
  evento,
  clubId,
  enBoteIds,
  inscriptosIds,
}: {
  evento: EventoVista;
  clubId: string;
  enBoteIds: string[];
  inscriptosIds: Set<string>;
}) {
  const sexo = evento.genero === 'X' ? undefined : evento.genero;
  const rama = evento.genero === 'F' ? 'Rama femenina' : evento.genero === 'M' ? 'Rama masculina' : 'Rama mixta';
  const lista = listarDeportistas({ clubId, ...(sexo ? { sexo } : {}) })
    .map((d, i) => ({ d, i }))
    .sort((a, b) => {
      const mismaA = a.d.categoriaId === evento.categoriaId ? 0 : 1;
      const mismaB = b.d.categoriaId === evento.categoriaId ? 0 : 1;
      if (mismaA !== mismaB) return mismaA - mismaB;
      const insA = inscriptosIds.has(a.d.id) ? 1 : 0;
      const insB = inscriptosIds.has(b.d.id) ? 1 : 0;
      if (insA !== insB) return insA - insB;
      return a.i - b.i;
    })
    .map((x) => x.d);

  return (
    <Tarjeta etiquetaAria="Deportistas del club disponibles" titulo="Deportistas del club disponibles" meta={undefined}>
      <p className={estilos.vacio} style={{ paddingTop: 0, paddingBottom: 12, marginTop: -8 }}>
        {rama} · categoría calculada y estado de la ficha médica
      </p>
      <ul className={estilos.lista}>
        {lista.map((d) => (
          <FilaDeportista
            key={d.id}
            deportista={d}
            evento={evento}
            enBote={enBoteIds.includes(d.id)}
            inscripto={inscriptosIds.has(d.id)}
          />
        ))}
      </ul>
    </Tarjeta>
  );
}

function BoteEnConstruccion({
  evento,
  clubId,
  enBoteIds,
}: {
  evento: EventoVista;
  clubId: string;
  enBoteIds: string[];
}) {
  const plazas = TRIPULANTES[evento.embarcacion];
  const plantel = listarDeportistas({ clubId });
  const ocupantes = enBoteIds
    .map((id) => plantel.find((d) => d.id === id))
    .filter((d): d is DeportistaVista => Boolean(d))
    .map((d) => ({ d, avisos: avisosDeInscripcion(d.id, evento.id) }));
  const totalAvisos = ocupantes.reduce((suma, o) => suma + o.avisos.length, 0);
  const faltan = plazas - ocupantes.length;

  let ayuda: string;
  if (faltan === 1) ayuda = 'Falta 1 palista para confirmar.';
  else if (faltan > 1) ayuda = `Faltan ${faltan} palistas para confirmar.`;
  else if (totalAvisos > 0) ayuda = `Se inscribe con ${totalAvisos} ${totalAvisos === 1 ? 'aviso' : 'avisos'} para la Federación.`;
  else ayuda = 'El bote está completo.';

  return (
    <Tarjeta etiquetaAria="Bote en construcción" titulo="Bote en construcción" meta={`${ocupantes.length} de ${plazas}`}>
      <div className={estilos.cuerpo} style={{ paddingTop: 0 }}>
        <div className={estilos.segmentos} aria-hidden="true">
          {Array.from({ length: plazas }, (_, i) => (
            <span key={i} className={`${estilos.segmento} ${i < ocupantes.length ? estilos.segmentoLleno : ''}`} />
          ))}
        </div>
        <p className={estilos.subtexto} style={{ margin: 0 }}>
          Elegí {plazas === 1 ? '1 palista' : `${plazas} palistas`} de la lista.
        </p>
        {Array.from({ length: plazas }, (_, i) => {
          const ocupante = ocupantes[i];
          if (!ocupante) {
            return (
              <div key={i} className={`${estilos.lugar} ${estilos.lugarLibre}`}>
                <Etiqueta>Lugar {i + 1}</Etiqueta>
                <span>Lugar libre</span>
              </div>
            );
          }
          const { d, avisos } = ocupante;
          return (
            <div key={i} className={estilos.lugar}>
              <Etiqueta>Lugar {i + 1}</Etiqueta>
              <div className={estilos.tripulante}>
                <span className={estilos.nombre}>{d.nombreCompleto}</span>
                <AccionNoDisponible variant="terciario" size="sm">
                  Quitar
                </AccionNoDisponible>
              </div>
              <span className={estilos.celdaMeta}>
                <span>
                  {d.categoriaTexto} · {d.sexoTexto}
                </span>
                <ChipFicha ficha={d.ficha} />
              </span>
              {avisos.length > 0 && (
                <div className={estilos.nota}>
                  <Icon icono={TriangleAlert} size={16} />
                  <span>
                    <strong>{avisos.map((a) => a.texto).join(' ')}</strong>{' '}
                    {d.sexo === 'F' ? 'Podés inscribirla igual' : 'Podés inscribirlo igual'}; la Federación lo va a ver.
                  </span>
                </div>
              )}
            </div>
          );
        })}
        <div className={estilos.pie}>
          <AccionNoDisponible fullWidth icon={Check}>
            Confirmar inscripción
          </AccionNoDisponible>
          <span className={estilos.subtexto}>{ayuda}</span>
        </div>
      </div>
    </Tarjeta>
  );
}

function BoteDelClub({ bote, evento, abierta }: { bote: BoteVista; evento: EventoVista; abierta: boolean }) {
  const avisos = bote.deportistas.flatMap((d) =>
    avisosDeInscripcion(d.id, evento.id).map((a) => `${d.nombreCompleto}: ${a.texto}`),
  );
  return (
    <div className={estilos.bote}>
      <Etiqueta>Bote {bote.numero}</Etiqueta>
      {bote.deportistas.map((d) => (
        <div key={d.id} className={estilos.tripulante}>
          <div className={estilos.itemTextos}>
            <span className={estilos.nombre}>{d.nombreCompleto}</span>
            <span className={estilos.subtexto}>
              {d.categoriaTexto} · {textoSexo(d.sexo)}
            </span>
          </div>
          <ChipFicha ficha={d.ficha} />
        </div>
      ))}
      {avisos.length > 0 && (
        <ul className={estilos.lista}>
          {avisos.map((aviso) => (
            <li key={aviso} className={estilos.nota} style={{ padding: '2px 0' }}>
              <Icon icono={TriangleAlert} size={16} />
              <span>{aviso}</span>
            </li>
          ))}
        </ul>
      )}
      {abierta && (
        <div>
          <AccionNoDisponible variant="terciario" size="sm">
            Quitar inscripción
          </AccionNoDisponible>
        </div>
      )}
    </div>
  );
}

/** D3: la lista de eventos, el evento elegido y, según el estado de la competencia, el armado o solo las inscripciones. */
export function VistaInscripcion({
  competencia,
  eventos,
  evento,
  clubId,
  inscripcionesPorEvento,
}: {
  competencia: CompetenciaVista;
  eventos: EventoVista[];
  evento: EventoVista;
  clubId: string;
  inscripcionesPorEvento: Map<string, number>;
}) {
  const abierta = competencia.estado === 'abiertas';
  const botesClub = inscripcionesDeEvento(evento.id).filter((b) => b.clubId === clubId);
  const inscriptosIds = new Set(botesClub.flatMap((b) => b.deportistas.map((d) => d.id)));
  const enBoteIds: string[] = evento.id === BORRADOR_D3.eventoId ? [...BORRADOR_D3.deportistaIds] : [];
  const plazas = TRIPULANTES[evento.embarcacion];
  const rama = evento.genero === 'F' ? 'femenina' : evento.genero === 'M' ? 'masculina' : 'mixta';

  return (
    <div className={estilos.d3}>
      <ListaEventos
        competencia={competencia}
        eventos={eventos}
        elegidoId={evento.id}
        inscripcionesPorEvento={inscripcionesPorEvento}
      />
      <div className={estilos.pagina}>
        <div className={estilos.itemTextos} style={{ gap: 6 }}>
          <Etiqueta>Evento elegido</Etiqueta>
          <h3 className={estilos.titulo}>{evento.lectura}</h3>
          <span className={estilos.subtexto}>
            {evento.embarcacion} · bote de {plazas === 1 ? '1 palista' : `${plazas} palistas`} · solo deportistas de la
            rama {rama}
          </span>
        </div>

        {abierta ? (
          <div className={estilos.columnasD3}>
            <DeportistasDisponibles evento={evento} clubId={clubId} enBoteIds={enBoteIds} inscriptosIds={inscriptosIds} />
            <BoteEnConstruccion evento={evento} clubId={clubId} enBoteIds={enBoteIds} />
          </div>
        ) : (
          <Toast tipo="info" titulo="Las inscripciones están cerradas.">
            Podés revisar lo que inscribió el club; ya no se pueden hacer cambios.
          </Toast>
        )}

        <Tarjeta
          etiquetaAria="Inscripciones del club en este evento"
          titulo="Inscripciones del club en este evento"
          nivel="h4"
          meta={textoBotes(botesClub.length)}
        >
          {botesClub.length === 0 ? (
            <p className={estilos.vacio}>
              {abierta
                ? 'Todavía no hay inscripciones del club en este evento.'
                : 'El club no inscribió botes en este evento.'}
            </p>
          ) : (
            <div className={estilos.botes}>
              {botesClub.map((b) => (
                <BoteDelClub key={b.inscripcionId} bote={b} evento={evento} abierta={abierta} />
              ))}
            </div>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}
