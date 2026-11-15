import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CircleCheck,
  ExternalLink,
  Eye,
  Flag,
  Keyboard,
  Pencil,
  Play,
  Send,
  Trophy,
} from 'lucide-react';
import { Button, EstadoSerieBadge, Icon, Input, PuntoEnVivo, Select, Time } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import { configuracionFederacion } from '@/datos';
import type { FilaResultado, SerieDetalle, SerieResumen } from '@/datos';
import { SIGNIFICADO_CODIGO } from '@/dominio/tiempos';
import { rutas } from '@/lib/rutas';
import { Barra, Etiqueta, listaDeNumeros, NumeroCarril, TarjetaJuez } from './Bloques';
import estilos from './juez.module.css';
import tablas from './tablas.module.css';
import disposicion from './disposicion.module.css';

interface Props {
  serie: SerieDetalle;
  /** Posición (1 en adelante) de la serie en la jornada. */
  numero: number;
  total: number;
  siguiente: SerieResumen | null;
}

const COLOR_MEDALLA = {
  oro: 'var(--medalla-oro)',
  plata: 'var(--medalla-plata)',
  bronce: 'var(--medalla-bronce)',
} as const;

const OPCIONES_CODIGO = [
  { value: '', label: '—' },
  { value: 'DSQ', label: 'DSQ' },
  { value: 'DNS', label: 'DNS' },
  { value: 'DNF', label: 'DNF' },
];

export function PanelSerie({ serie, numero, total, siguiente }: Props) {
  return (
    <div className={estilos.pagina}>
      <Encabezado serie={serie} numero={numero} total={total} />
      {serie.estado === 'armada' && <Armada serie={serie} />}
      {serie.estado === 'en-vivo' && <EnVivo serie={serie} />}
      {serie.estado === 'terminada' && <Terminada serie={serie} />}
      {serie.estado === 'publicada' && <Publicada serie={serie} siguiente={siguiente} />}
    </div>
  );
}

function Encabezado({ serie, numero, total }: { serie: SerieDetalle; numero: number; total: number }) {
  return (
    <div className={disposicion.cabeceraSerie}>
      <div className={disposicion.cabeceraSerieTextos}>
        <Etiqueta>
          Serie activa · {numero} de {total}
        </Etiqueta>
        <h3 className={disposicion.tituloSerie}>{serie.titulo}</h3>
        <span className={disposicion.categoriaLinea}>
          {serie.categoriaGenero} · <span className={estilos.mono}>{serie.horaTexto}</span>
        </span>
        {serie.fase.avanceTexto && (
          <span className={disposicion.metaLinea}>
            <Icon icono={Flag} size={16} />
            {serie.fase.avanceTexto}
          </span>
        )}
        {serie.esFinal && (
          <span className={disposicion.metaLinea}>
            <Icon icono={Trophy} size={16} />
            Final: define el podio
          </span>
        )}
      </div>
      <div style={{ flex: 'none', display: 'flex' }}>
        {serie.estado === 'terminada' ? (
          <EstadoSerieBadge estado="terminada">Terminada · en revisión</EstadoSerieBadge>
        ) : serie.estado === 'publicada' ? (
          <EstadoSerieBadge estado="publicada">Publicada · {serie.publicada} h</EstadoSerieBadge>
        ) : (
          <EstadoSerieBadge estado={serie.estado} />
        )}
      </div>
    </div>
  );
}

function Armada({ serie }: { serie: SerieDetalle }) {
  return (
    <TarjetaJuez
      etiquetaAria="Carriles"
      titulo="Carriles"
      meta={`${serie.cantidadCarriles} botes · ${serie.evento.embarcacion}`}
    >
      <div className={`${estilos.encabezadoTabla} ${tablas.carriles}`}>
        <span className={tablas.aN}>Carril</span>
        <span className={tablas.aNom}>{serie.evento.embarcacion === 'K1' || serie.evento.embarcacion === 'C1' ? 'Deportista' : 'Tripulación'}</span>
        <span className={tablas.aClub}>Club</span>
      </div>
      {serie.carriles.map((c) => (
        <div key={c.numero} className={`${estilos.fila} ${tablas.carriles}`}>
          <span className={tablas.aN}>
            <NumeroCarril n={c.numero} />
          </span>
          <span className={`${estilos.nombre} ${tablas.aNom}`}>{c.bote.nombre}</span>
          <span className={tablas.aClub}>{c.bote.clubNombre}</span>
        </div>
      ))}
      <div className={estilos.pie}>
        <span className={estilos.pieTexto}>
          Al comenzar, el público ve la serie «En vivo» y se habilita la carga de tiempos.
        </span>
        <div className={estilos.pieAcciones}>
          <AccionNoDisponible variant="terciario">Editar armado</AccionNoDisponible>
          <AccionNoDisponible icon={Play}>Comenzar</AccionNoDisponible>
        </div>
      </div>
    </TarjetaJuez>
  );
}

function EnVivo({ serie }: { serie: SerieDetalle }) {
  const sinCargar = serie.carriles.filter((c) => !c.tiempo && !c.codigo).map((c) => c.numero);
  const textoFaltan =
    sinCargar.length === 0
      ? 'Todo cargado. Revisá los tiempos y terminá la carrera.'
      : sinCargar.length === 1
        ? `Falta el carril ${sinCargar[0]}. Cargá un tiempo o un código en cada uno para terminar.`
        : `Faltan los carriles ${listaDeNumeros(sinCargar)}. Cargá un tiempo o un código en cada uno para terminar.`;

  return (
    <>
      <div role="status" className={`${estilos.banda} ${estilos.bandaVivo}`}>
        <PuntoEnVivo tamano={14} />
        <span className={estilos.enVivoRotulo}>EN VIVO</span>
        <span className={estilos.enVivoTexto}>
          Largó a las <span className={estilos.mono}>{serie.largada} h</span>. El público ve la serie en vivo; los
          tiempos no se muestran hasta que publiques.
        </span>
      </div>
      <TarjetaJuez
        etiquetaAria="Carga de tiempos"
        titulo="Carga de tiempos"
        meta={`${serie.tiemposCargados} de ${serie.cantidadCarriles} cargados`}
      >
        <div className={estilos.avisoFila}>
          <Icon icono={Keyboard} size={18} />
          <span>
            Escribí solo números: <span className={estilos.mono}>14127</span> → <span className={estilos.mono}>1:41.27</span>.
            Tab o Enter pasa al carril siguiente.
          </span>
        </div>
        <div className={`${estilos.encabezadoTabla} ${tablas.carga}`}>
          <span className={tablas.aN}>Carril</span>
          <span className={tablas.aNom}>Deportista · club</span>
          <span className={`${tablas.aT} ${estilos.derecha}`}>Tiempo</span>
          <span className={tablas.aC}>Código</span>
        </div>
        {serie.carriles.map((c) => (
          <div key={c.numero} className={`${estilos.fila} ${tablas.carga}`}>
            <span className={tablas.aN}>
              <NumeroCarril n={c.numero} />
            </span>
            <span className={`${estilos.nombreDoble} ${tablas.aNom}`}>
              <span className={estilos.nombre}>{c.bote.nombre}</span>
              <span className={estilos.subtexto}>{c.bote.clubNombre}</span>
              {c.codigo && (
                <span className={estilos.subtexto}>
                  {c.motivo}
                  {c.detalle ? ` · ${c.detalle}` : ''}
                </span>
              )}
            </span>
            <div role="group" aria-label={`Tiempo del carril ${c.numero}`} className={`${tablas.aT} ${tablas.campoTiempo}`}>
              <Input soloLectura mono value={c.tiempo ?? ''} placeholder="m:ss.cc" />
            </div>
            <div role="group" aria-label={`Código del carril ${c.numero}`} className={tablas.aC}>
              <Select soloLectura options={OPCIONES_CODIGO} value={c.codigo ?? ''} />
            </div>
          </div>
        ))}
        <div className={estilos.pie}>
          <div className={estilos.progresoBloque}>
            <span className={estilos.progresoTitulo}>
              {serie.tiemposCargados} de {serie.cantidadCarriles} carriles cargados
            </span>
            <Barra valor={serie.tiemposCargados} total={serie.cantidadCarriles} />
            <span className={estilos.pieTexto} style={{ flex: 'none' }}>
              {textoFaltan}
            </span>
          </div>
          <AccionNoDisponible icon={Flag}>Terminar carrera</AccionNoDisponible>
        </div>
      </TarjetaJuez>
    </>
  );
}

function Pos({ fila, esFinal }: { fila: FilaResultado; esFinal: boolean }) {
  const medalla = esFinal && fila.medalla ? COLOR_MEDALLA[fila.medalla] : null;
  return (
    <span
      className={`${estilos.posicion} ${tablas.aPos}`}
      style={{ color: fila.clasificado ? 'var(--color-exito)' : undefined }}
    >
      {fila.posicion ?? '—'}
      {medalla && <span aria-hidden="true" className={estilos.medalla} style={{ background: medalla }} />}
    </span>
  );
}

function Terminada({ serie }: { serie: SerieDetalle }) {
  const filas = serie.resultados ?? [];
  const finales = serie.esFinal;
  const conCodigo = filas.filter((f) => f.codigo);
  const clase = finales ? tablas.resPtsEdita : tablas.resEdita;
  const puntos = configuracionFederacion().tablaPuntos.join('-');

  return (
    <>
      <div role="status" className={`${estilos.banda} ${estilos.bandaInfo}`}>
        <span className={estilos.bandaIcono}>
          <Icon icono={Eye} size={24} />
        </span>
        <div className={estilos.bandaTextos}>
          <span className={estilos.bandaTitulo}>El público ve «En revisión» hasta que publiques.</span>
          <span className={estilos.bandaTexto}>
            {finales
              ? 'Posiciones y puntos ya están calculados por tiempo. Revisalos y, si hace falta, corregí un tiempo.'
              : 'Las posiciones ya están calculadas por tiempo. Revisalas y, si hace falta, corregí un tiempo.'}
          </span>
        </div>
      </div>
      <TarjetaJuez etiquetaAria="Resultados calculados" titulo="Resultados para revisar" meta="Orden por tiempo">
        <div className={`${estilos.encabezadoTabla} ${clase}`}>
          <span className={tablas.aPos}>Pos</span>
          <span className={tablas.aCarril} style={{ font: 'inherit' }}>
            Carril
          </span>
          <span className={tablas.aNom}>Deportista · club</span>
          <span className={`${tablas.aT} ${estilos.derecha}`}>Tiempo · dif.</span>
          {finales && <span className={`${tablas.aPts} ${estilos.derecha}`} style={{ font: 'inherit' }}>Pts</span>}
          <span className={tablas.aEdita} />
        </div>
        {filas.map((f) => (
          <div
            key={f.carril}
            className={`${estilos.fila} ${clase} ${f.clasificado ? estilos.filaClasificado : ''}`}
          >
            <Pos fila={f} esFinal={finales} />
            <span className={tablas.aCarril}>{f.carril}</span>
            <span className={`${estilos.nombreDoble} ${tablas.aNom}`}>
              <span className={estilos.nombre}>{f.bote.nombre}</span>
              <span className={estilos.subtexto}>
                <span className={tablas.celular}>Carril {f.carril} · </span>
                {f.bote.clubNombre}
                {finales && f.puntos !== null && <span className={tablas.celular}> · {f.puntos} pts</span>}
              </span>
            </span>
            <span className={tablas.aTiempo}>
              {f.tiempo ? (
                <Time valor={f.tiempo} diferencia={f.diferencia ?? undefined} />
              ) : (
                <Time valor={f.codigo ?? '—'} apagado />
              )}
            </span>
            {finales && <span className={tablas.aPts}>{f.puntos ?? '—'}</span>}
            <span className={tablas.aEdita}>
              <AccionNoDisponible variant="icono" icon={Pencil} label={`Corregir el tiempo del carril ${f.carril}`} />
            </span>
          </div>
        ))}
        <div className={estilos.notas}>
          {conCodigo.map((f) => (
            <span key={f.carril} className={estilos.cajaCodigo}>
              <span className={estilos.cajaCodigoIcono}>
                <Icon icono={AlertCircle} size={18} />
              </span>
              <span>
                <strong>
                  {f.codigo} · {f.codigo ? SIGNIFICADO_CODIGO[f.codigo] : ''}, carril {f.carril}.
                </strong>{' '}
                {f.motivo}
                {f.detalle ? ` · ${f.detalle}` : ''}
              </span>
            </span>
          ))}
          <span>
            {serie.leyenda}
            {finales ? ` Puntos de la final: ${puntos}.` : ''}
          </span>
        </div>
        <div className={estilos.pie}>
          <span className={estilos.pieTexto}>
            {finales
              ? 'Al publicar, el público ve posiciones, tiempos y puntos.'
              : 'Al publicar, el público ve posiciones y tiempos oficiales.'}
          </span>
          <AccionNoDisponible icon={Send}>Publicar resultados</AccionNoDisponible>
        </div>
      </TarjetaJuez>
    </>
  );
}

function Publicada({ serie, siguiente }: { serie: SerieDetalle; siguiente: SerieResumen | null }) {
  const filas = serie.resultados ?? [];
  const llegaron = filas.filter((f) => f.tiempo).length;
  const conCodigo = filas.filter((f) => f.codigo);
  const porCodigo = (['DSQ', 'DNS', 'DNF'] as const)
    .map((c) => ({ c, k: conCodigo.filter((f) => f.codigo === c).length }))
    .filter((x) => x.k > 0);
  const cuenta = [`${llegaron} llegaron`, ...porCodigo.map((x) => `${x.k} ${x.c}`)].join(' · ');
  const notas = conCodigo.length
    ? conCodigo
        .map((f) => `${f.codigo} · carril ${f.carril}: ${f.motivo}${f.detalle ? ` · ${f.detalle}` : ''}`)
        .join('. ') + '.'
    : 'Sin descalificaciones ni abandonos.';
  const primeros = filas.filter((f) => f.posicion !== null).slice(0, 3);

  return (
    <>
      <div role="status" className={`${estilos.banda} ${estilos.bandaExito}`}>
        <span className={estilos.bandaIcono}>
          <Icon icono={CircleCheck} size={24} />
        </span>
        <div className={estilos.bandaTextos}>
          <span className={estilos.bandaTitulo}>Resultados publicados · {serie.publicada} h.</span>
          <span className={estilos.bandaTexto}>El público ya ve posiciones y tiempos oficiales de {serie.titulo}.</span>
        </div>
      </div>
      <TarjetaJuez etiquetaAria="Resumen" titulo="Resumen" meta={cuenta}>
        {(serie.esFinal || serie.fase.avanceTexto) && (
          <div
            className={estilos.avisoFila}
            style={{ background: 'var(--color-exito-bg)', color: 'var(--color-exito)', fontSize: 16, fontWeight: 700 }}
          >
            <Icon icono={serie.esFinal ? Trophy : Flag} size={20} />
            <span>{serie.esFinal ? 'Podio' : serie.fase.avanceTexto}</span>
          </div>
        )}
        {primeros.map((f) => (
          <div key={f.carril} className={`${estilos.fila} ${tablas.resumen}`}>
            <Pos fila={f} esFinal={serie.esFinal} />
            <span className={tablas.aCarril}>{f.carril}</span>
            <span className={`${estilos.nombreDoble} ${tablas.aNom}`}>
              <span className={estilos.nombre}>{f.bote.nombre}</span>
              <span className={estilos.subtexto}>
                <span className={tablas.celular}>Carril {f.carril} · </span>
                {f.bote.clubNombre}
              </span>
            </span>
            <span className={tablas.aTiempo}>
              {f.tiempo && <Time valor={f.tiempo} diferencia={f.diferencia ?? undefined} />}
            </span>
          </div>
        ))}
        <div className={estilos.pie} style={{ background: 'transparent' }}>
          <span className={estilos.pieTexto}>{notas}</span>
          <Link href={rutas.serie(serie.competenciaId, serie.id)} className={estilos.enlaceAccion}>
            Ver cómo lo ve el público
            <Icon icono={ExternalLink} size={16} />
          </Link>
        </div>
      </TarjetaJuez>
      {siguiente ? (
        <section aria-label="Siguiente serie" className={estilos.tarjeta}>
          <div
            className={estilos.pie}
            style={{ background: 'var(--color-superficie)', borderTop: 'none', padding: 20, gap: 16 }}
          >
            <span className={estilos.mono} style={{ font: '600 28px/1 var(--font-mono)' }}>
              {siguiente.hora}
            </span>
            <div className={estilos.nombreDoble} style={{ flex: '1 1 220px', gap: 6 }}>
              <Etiqueta>Siguiente serie</Etiqueta>
              <span style={{ font: '700 22px/1.15 var(--font-titulo)' }}>{siguiente.titulo}</span>
              <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 15 }}>
                {siguiente.categoriaGenero}
                <EstadoSerieBadge estado={siguiente.estado} />
              </span>
            </div>
            <Button
              iconRight={ArrowRight}
              href={`${rutas.panel.juez.jornada()}?serie=${encodeURIComponent(siguiente.id)}`}
            >
              Ir a la siguiente serie
            </Button>
          </div>
        </section>
      ) : (
        <div className={estilos.tarjeta} style={{ padding: '16px 20px', fontSize: 15, lineHeight: 1.45 }}>
          <strong>Terminaste la jornada.</strong> No quedan series por largar.
        </div>
      )}
    </>
  );
}
