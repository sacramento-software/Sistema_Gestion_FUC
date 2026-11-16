import { Check, ChevronLeft, CircleAlert, CircleCheck, ClipboardCheck, Clock, Flag, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { Contenedor } from '@/components/cascaras';
import { CategoryTag } from '@/components/ds/CategoryTag';
import { cx } from '@/components/ds/cx';
import { EstadoSerieBadge } from '@/components/ds/EstadoSerieBadge';
import { Filete } from '@/components/ds/Filete';
import { Icon } from '@/components/ds/Icon';
import { PhaseTrack } from '@/components/ds/PhaseTrack';
import { PuntoEnVivo } from '@/components/ds/PuntoEnVivo';
import { Time } from '@/components/ds/Time';
import type { BoteVista, FichaDeportista, FilaResultado, SerieDetalle } from '@/datos';
import { formatearFecha } from '@/dominio';
import { rutas } from '@/lib/rutas';
import base from './base.module.css';
import { BotonCompartir } from './BotonCompartir';
import { FichaContenido } from './FichaContenido';
import { FichaDesplegable } from './FichaDesplegable';
import { Medalla } from './Medalla';
import { NombresBote } from './NombresBote';
import estilos from './PaginaSerie.module.css';

const PILDORA_CODIGO = { DSQ: 'Descalificado', DNS: 'No largó', DNF: 'No terminó' } as const;

const TEXTO_BADGE = (serie: SerieDetalle): string | undefined => {
  switch (serie.estado) {
    case 'armada':
      return `Próxima · ${serie.horaTexto}`;
    case 'terminada':
      return 'Terminada · en revisión';
    case 'publicada':
      return 'Resultados publicados';
    default:
      return undefined;
  }
};

function Banda({ serie }: { serie: SerieDetalle }) {
  switch (serie.estado) {
    case 'armada':
      return (
        <div role="status" className={cx(estilos.banda, estilos.bandaNeutra)}>
          <span className={cx(estilos.iconoBanda, estilos.iconoNeutro)}>
            <Icon icono={Clock} size={24} />
          </span>
          <div className={estilos.textosBanda}>
            <span className={base.rotulo}>Largada</span>
            <span className={estilos.horaGrande}>{serie.horaTexto}</span>
            <span className={estilos.descripcion}>Los carriles ya están asignados. Mirá quién larga y por cuál carril.</span>
          </div>
        </div>
      );
    case 'en-vivo':
      return (
        <div role="status" className={cx(estilos.banda, estilos.bandaVivo)}>
          <span className={estilos.marcaVivo}>
            <PuntoEnVivo tamano={8} />
            <span className={estilos.enVivo}>EN VIVO</span>
          </span>
          <span className={estilos.textoVivo}>La serie está en carrera. Los tiempos se publican al cierre de la serie.</span>
        </div>
      );
    case 'terminada':
      return (
        <div role="status" className={cx(estilos.banda, estilos.bandaInfo)}>
          <span className={cx(estilos.iconoBanda, estilos.iconoInfo)}>
            <Icon icono={ClipboardCheck} size={24} />
          </span>
          <div className={estilos.textosBanda}>
            <span className={estilos.tituloBanda}>Resultados en revisión</span>
            <span className={estilos.descripcion}>
              La serie terminó. Los jueces están revisando llegadas y tiempos; los publicaremos apenas termine la revisión.
            </span>
          </div>
        </div>
      );
    case 'publicada':
      return (
        <div role="status" className={cx(estilos.banda, estilos.bandaExito)}>
          <span className={cx(estilos.iconoBanda, estilos.iconoExito)}>
            <Icon icono={CircleCheck} size={24} />
          </span>
          <div className={estilos.textosBanda}>
            <span className={estilos.tituloBanda}>Resultados publicados · {serie.publicada} h</span>
            <span className={estilos.descripcion}>Posiciones y tiempos oficiales de la serie.</span>
          </div>
        </div>
      );
  }
}

function Carriles({
  serie,
  seleccionado,
  hrefDeportista,
}: {
  serie: SerieDetalle;
  seleccionado?: string;
  hrefDeportista: (id: string) => string;
}) {
  const nota =
    serie.estado === 'en-vivo'
      ? 'Los tiempos se publican al cierre de la serie.'
      : serie.estado === 'terminada'
        ? 'Los tiempos se muestran cuando termina la revisión.'
        : null;
  return (
    <section aria-label="Carriles" className={base.tarjeta}>
      <Filete />
      <div className={estilos.cabeceraSeccion}>
        <h2 className={base.tituloTarjeta}>Carriles</h2>
        <span className={base.rotulo}>
          {serie.cantidadCarriles} botes · {serie.evento.embarcacion}
        </span>
      </div>
      <div className={cx(estilos.encabezadoTabla, estilos.gridCarriles)} aria-hidden="true">
        <span>Carril</span>
        <span>Deportista</span>
        <span>Club</span>
        <span>Bote</span>
      </div>
      {/* Ningún tiempo: aunque la consulta traiga `tiemposCargados`, acá solo van carril, nombres y club. */}
      {serie.carriles.map((c) => (
        <div
          key={c.numero}
          className={cx(estilos.fila, estilos.gridCarriles, esDe(c.bote, seleccionado) && estilos.seleccionada)}
        >
          <span className={estilos.numero}>{c.numero}</span>
          <div className={estilos.nombre}>
            <NombresBote bote={c.bote} hrefDeportista={hrefDeportista} />
          </div>
          <span className={estilos.club}>{c.bote.clubNombre}</span>
          <span className={estilos.etiquetaBote}>
            <CategoryTag>{c.bote.embarcacion}</CategoryTag>
          </span>
        </div>
      ))}
      {nota && <div className={estilos.nota}>{nota}</div>}
    </section>
  );
}

const esDe = (bote: BoteVista, deportistaId?: string) =>
  deportistaId ? bote.deportistas.some((d) => d.id === deportistaId) : false;

function Pildora({ fila, destino }: { fila: FilaResultado; destino?: string }) {
  if (fila.codigo) {
    return (
      <span className={cx(base.pildora, base.pildoraPeligro, estilos.pildora)}>
        <Icon icono={X} size={14} />
        {PILDORA_CODIGO[fila.codigo]}
      </span>
    );
  }
  if (fila.clasificado) {
    return (
      <span className={cx(base.pildora, base.pildoraExito, estilos.pildora)}>
        <Icon icono={Check} size={14} />
        {destino ? `Avanza a ${destino}` : 'Clasificado'}
      </span>
    );
  }
  return null;
}

function Resultados({
  serie,
  seleccionado,
  hrefDeportista,
}: {
  serie: SerieDetalle;
  seleccionado?: string;
  hrefDeportista: (id: string) => string;
}) {
  const filas = serie.resultados ?? [];
  const conPuntos = serie.esFinal;
  const grid = conPuntos ? estilos.gridResultadosPuntos : estilos.gridResultados;
  const ultimoClasificado = filas.reduce((ultimo, f, i) => (f.clasificado ? i : ultimo), -1);
  const conCodigo = filas.filter((f) => f.codigo);

  return (
    <section aria-label="Resultados" className={base.tarjeta}>
      <Filete />
      <div className={estilos.cabeceraSeccion}>
        <h2 className={base.tituloTarjeta}>Resultados</h2>
        <span className={base.rotulo}>Publicados {serie.publicada} h</span>
      </div>
      {serie.fase.avanceTexto && (
        <div className={estilos.avance}>
          <Icon icono={Flag} size={20} />
          <span>{serie.fase.avanceTexto}</span>
        </div>
      )}
      <div className={cx(estilos.encabezadoTabla, estilos.encabezadoResultados, grid)} aria-hidden="true">
        <span className={estilos.aPos}>Pos</span>
        <span className={estilos.aCarril}>Carril</span>
        <span className={estilos.aNombre}>Deportista · club</span>
        <span className={estilos.aTiempo}>Tiempo</span>
        {conPuntos && <span className={estilos.aPuntos}>Pts</span>}
        <span className={estilos.aPildora} />
      </div>
      {filas.map((f, i) => (
        <div
          key={f.carril}
          className={cx(
            estilos.filaResultado,
            grid,
            f.clasificado && estilos.clasificado,
            i === ultimoClasificado && estilos.ultimoClasificado,
            esDe(f.bote, seleccionado) && estilos.seleccionada,
          )}
        >
          <span className={cx(estilos.posicion, estilos.aPos, f.posicion == null && estilos.apagado)}>
            {f.posicion ?? '—'}
            {conPuntos && <Medalla medalla={f.medalla} />}
          </span>
          <span className={cx(estilos.carrilEscritorio, estilos.aCarril)}>{f.carril}</span>
          <span className={cx(estilos.nombreResultado, estilos.aNombre)}>
            <NombresBote bote={f.bote} hrefDeportista={hrefDeportista} />
            <span className={estilos.clubResultado}>{f.bote.clubNombre}</span>
          </span>
          <span className={cx(estilos.tiempo, estilos.aTiempo)}>
            <Time valor={f.tiempo ?? f.codigo ?? '—'} diferencia={f.diferencia ?? undefined} apagado={Boolean(f.codigo)} />
          </span>
          <span className={estilos.meta}>
            <span className={estilos.carrilCelular}>Carril {f.carril}</span>
            {conPuntos && f.puntos != null && <span className={cx(estilos.puntos, estilos.aPuntos)}>{f.puntos} pts</span>}
            <span className={estilos.aPildora}>
              <Pildora fila={f} destino={serie.fase.avanceDestino} />
            </span>
          </span>
        </div>
      ))}
      <div className={estilos.pie}>
        {conCodigo.map((f) => (
          <span key={f.carril} className={estilos.cajaCodigo}>
            <span className={estilos.iconoCaja}>
              <Icon icono={CircleAlert} size={18} />
            </span>
            <span>
              <strong>
                {f.codigo} · {f.bote.nombre}, carril {f.carril}.
              </strong>{' '}
              {f.motivo}
              {f.detalle ? ` · ${f.detalle}` : ''}
            </span>
          </span>
        ))}
        {serie.leyenda && <span>{serie.leyenda}</span>}
        {serie.esFinal && <span>Puntos de la final: 10-8-6-5-4-3-2-1.</span>}
      </div>
    </section>
  );
}

export interface PaginaSerieProps {
  serie: SerieDetalle;
  /** Ficha abierta sobre la página (`?deportista=`), si es válida. */
  ficha: FichaDeportista | null;
}

/** P5: una serie en sus cuatro estados, con la ficha del deportista como panel desplegable. */
export function PaginaSerie({ serie, ficha }: PaginaSerieProps) {
  const urlSerie = rutas.serie(serie.competenciaId, serie.id);
  const hrefDeportista = (id: string) => `${urlSerie}?deportista=${encodeURIComponent(id)}`;
  const seleccionado = ficha?.deportista.id;
  const textoBadge = TEXTO_BADGE(serie);

  return (
    <Contenedor className={estilos.pagina}>
      <Link href={rutas.competencia(serie.competenciaId)} className={base.atras}>
        <Icon icono={ChevronLeft} size={18} />
        {serie.competencia.nombre}
      </Link>

      <div className={estilos.titulo}>
        <div className={estilos.titulos}>
          <h1 className={estilos.h1}>{serie.titulo}</h1>
          <span className={estilos.subtitulo}>
            {serie.categoriaGenero} · <span className={base.mono}>{serie.horaTexto}</span>
          </span>
          <span className={base.dato}>
            <Icon icono={MapPin} size={16} />
            {serie.competencia.sede} · {formatearFecha(serie.fecha, 'media')}
          </span>
        </div>
        <div className={estilos.acciones}>
          <EstadoSerieBadge estado={serie.estado}>{textoBadge}</EstadoSerieBadge>
          <BotonCompartir titulo={`${serie.titulo} · ${serie.categoriaGenero}`} />
        </div>
      </div>

      <PhaseTrack fases={serie.fasesDelEvento} actual={serie.indiceFase} />
      <Banda serie={serie} />

      {serie.estado === 'publicada' ? (
        <Resultados serie={serie} seleccionado={seleccionado} hrefDeportista={hrefDeportista} />
      ) : (
        <Carriles serie={serie} seleccionado={seleccionado} hrefDeportista={hrefDeportista} />
      )}

      {ficha && (
        <FichaDesplegable
          key={ficha.deportista.id}
          nombre={ficha.deportista.nombreCompleto}
          cerrarHref={urlSerie}
          rutaCompartir={rutas.deportista(ficha.deportista.id)}
        >
          <FichaContenido ficha={ficha} hrefDeportista={hrefDeportista} variante="panel" />
        </FichaDesplegable>
      )}
    </Contenedor>
  );
}
