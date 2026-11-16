import Link from 'next/link';
import { ArrowRight, Clock, Plus, Save, Trash2 } from 'lucide-react';
import { EstadoSerieBadge, Input, PhaseTrack, Tabs } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import {
  eventosDeCompetencia,
  inscripcionesDeEvento,
  configuracionFederacion,
  seriesPublicadas,
  serieEnVivo,
  type BoteVista,
  type CompetenciaVista,
  type EventoVista,
  type SerieDetalle,
} from '@/datos';
import { formatearFecha } from '@/dominio';
import { rutas } from '@/lib/rutas';
import { armarUrl, BandaEnVivo, BandaInfo, Etiqueta, Tarjeta, Vacio } from './Bloques';
import { FiltroClub } from './FiltroClub';
import estilos from './federacion.module.css';

export const PESTANAS = [
  { id: 'programa', label: 'Programa' },
  { id: 'inscripciones', label: 'Inscripciones' },
  { id: 'series', label: 'Series' },
  { id: 'resultados', label: 'En vivo y resultados' },
  { id: 'configuracion', label: 'Configuración' },
] as const;

export type IdPestana = (typeof PESTANAS)[number]['id'];

const ETAPAS = ['Inscripciones abiertas', 'Inscripciones cerradas', 'En curso', 'Finalizada'];
const INDICE_ETAPA: Record<CompetenciaVista['estado'], number> = { abiertas: 0, cerradas: 1, curso: 2, finalizada: 3 };

function Etapas({ competencia }: { competencia: CompetenciaVista }) {
  const actual = INDICE_ETAPA[competencia.estado];
  const siguiente = ETAPAS[actual + 1];
  return (
    <section aria-label="Etapa de la competencia" className={estilos.tarjeta}>
      <div className={estilos.etapas}>
        <Etiqueta>Etapa</Etiqueta>
        <PhaseTrack fases={ETAPAS} actual={actual} />
        {(siguiente || (competencia.estado === 'abiertas' && competencia.cierre)) && (
          <div className={estilos.etapasAccion}>
            {siguiente && (
              <AccionNoDisponible variant="secundario" icon={ArrowRight}>
                Pasar a {siguiente}
              </AccionNoDisponible>
            )}
            {competencia.estado === 'abiertas' && competencia.cierre && (
              <span className={estilos.subtexto}>{competencia.cierre.texto}</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Programa({ eventos }: { eventos: EventoVista[] }) {
  return (
    <>
      <div>
        <AccionNoDisponible variant="secundario" icon={Plus}>
          Agregar evento del catálogo
        </AccionNoDisponible>
      </div>
      {eventos.map((e) => (
        <section key={e.id} aria-label={e.lectura} className={estilos.evento}>
          <div className={estilos.eventoCabecera}>
            <div className={estilos.eventoTextos}>
              <span className={estilos.codigo}>{e.codigo}</span>
              <h3 className={estilos.eventoTitulo}>{e.lectura}</h3>
            </div>
            <div className={estilos.accionesIcono}>
              <AccionNoDisponible variant="icono" icon={Clock} label={`Editar horario de ${e.lectura}`} />
              <AccionNoDisponible variant="icono" icon={Trash2} label={`Quitar ${e.lectura}`} />
            </div>
          </div>
          {e.fases.map((f) => (
            <div key={f.id} className={estilos.faseFila}>
              <span>
                <span className={estilos.faseTitulo}>{f.nombre}</span> · {formatearFecha(f.fecha, 'dia-corto')} · {f.horaTexto}
              </span>
              <span className={estilos.subtexto}>
                {f.prevista ? 'Prevista' : `${f.series.length} ${f.series.length === 1 ? 'serie' : 'series'}`}
              </span>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

function agruparPorClub(botes: BoteVista[]): { clubId: string; clubNombre: string; botes: BoteVista[] }[] {
  const grupos: { clubId: string; clubNombre: string; botes: BoteVista[] }[] = [];
  for (const b of botes) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.clubId === b.clubId) ultimo.botes.push(b);
    else grupos.push({ clubId: b.clubId, clubNombre: b.clubNombre, botes: [b] });
  }
  return grupos;
}

function Inscripciones({ competencia, eventos, club }: { competencia: CompetenciaVista; eventos: EventoVista[]; club?: string }) {
  const porEvento = eventos.map((e) => ({ evento: e, botes: inscripcionesDeEvento(e.id) }));
  const clubesMap = new Map<string, string>();
  for (const { botes } of porEvento) for (const b of botes) clubesMap.set(b.clubId, b.clubNombre);
  const clubes = [...clubesMap.entries()].map(([id, nombre]) => ({ id, nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const clubValido = club && clubesMap.has(club) ? club : '';

  const filtrados = porEvento.map(({ evento, botes }) => ({
    evento,
    botes: clubValido ? botes.filter((b) => b.clubId === clubValido) : botes,
  }));
  const totalBotes = filtrados.reduce((s, x) => s + x.botes.length, 0);
  const totalClubes = new Set(filtrados.flatMap((x) => x.botes.map((b) => b.clubId))).size;

  return (
    <>
      <FiltroClub base={rutas.panel.federacion.competencia(competencia.id)} pestana="inscripciones" actual={clubValido} clubes={clubes} />
      <div className={estilos.totales} aria-label="Totales">
        <span>
          <span className={`${estilos.metricaValor}`}>{totalBotes}</span> <span className={estilos.subtexto}>botes</span>
        </span>
        <span>
          <span className={`${estilos.metricaValor}`}>{totalClubes}</span>{' '}
          <span className={estilos.subtexto}>{totalClubes === 1 ? 'club' : 'clubes'}</span>
        </span>
      </div>
      {totalBotes === 0 ? (
        <section className={estilos.tarjeta}>
          <Vacio>Todavía no hay inscripciones.</Vacio>
        </section>
      ) : (
        filtrados
          .filter((x) => x.botes.length > 0 || !clubValido)
          .map(({ evento, botes }) => (
            <section key={evento.id} aria-label={evento.lectura} className={estilos.evento}>
              <div className={estilos.eventoCabecera}>
                <div className={estilos.eventoTextos}>
                  <span className={estilos.codigo}>{evento.codigo}</span>
                  <h3 className={estilos.eventoTitulo}>{evento.lectura}</h3>
                </div>
                <Etiqueta>
                  {botes.length} botes · {new Set(botes.map((b) => b.clubId)).size} clubes
                </Etiqueta>
              </div>
              {botes.length === 0 && <p className={estilos.vacio}>Sin inscriptos.</p>}
              {agruparPorClub(botes).map((g) => (
                <div key={g.clubId}>
                  <div className={estilos.grupoClub}>
                    <Etiqueta>
                      {g.clubNombre} · {g.botes.length} {g.botes.length === 1 ? 'bote' : 'botes'}
                    </Etiqueta>
                  </div>
                  {g.botes.map((b) => (
                    <div key={b.inscripcionId} className={estilos.boteFila}>
                      <span className={estilos.filaTitulo}>{b.nombre}</span>
                      <span className={estilos.subtexto}>
                        Bote {b.numero} · {b.embarcacion}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          ))
      )}
    </>
  );
}

function Series({ eventos }: { eventos: EventoVista[] }) {
  const hayAlguna = eventos.some((e) => e.fases.some((f) => f.series.length > 0));
  return (
    <>
      <BandaInfo>El armado de las series lo hace el juez central.</BandaInfo>
      {!hayAlguna ? (
        <section className={estilos.tarjeta}>
          <Vacio>Todavía no se armaron las series.</Vacio>
        </section>
      ) : (
        eventos.map((e) => (
          <section key={e.id} aria-label={e.lectura} className={estilos.evento}>
            <div className={estilos.eventoCabecera}>
              <div className={estilos.eventoTextos}>
                <span className={estilos.codigo}>{e.codigo}</span>
                <h3 className={estilos.eventoTitulo}>{e.lectura}</h3>
              </div>
            </div>
            {e.fases.map((f) => (
              <div key={f.id}>
                <div className={estilos.grupoClub}>
                  <Etiqueta>
                    {f.nombre} · {formatearFecha(f.fecha, 'dia-corto')} · {f.horaTexto}
                  </Etiqueta>
                </div>
                {f.series.length === 0 ? (
                  <p className={estilos.nota} style={{ padding: '12px 20px' }}>
                    Todavía no se armaron las series.
                  </p>
                ) : (
                  f.series.map((s) => (
                    <div key={s.id} className={estilos.faseFila}>
                      <span>
                        <span className={estilos.faseTitulo}>{s.nombre}</span> · <span className={estilos.mono}>{s.hora}</span> ·{' '}
                        {s.cantidadCarriles} {s.cantidadCarriles === 1 ? 'carril' : 'carriles'}
                      </span>
                      <EstadoSerieBadge estado={s.estado} />
                    </div>
                  ))
                )}
              </div>
            ))}
          </section>
        ))
      )}
    </>
  );
}

const TEXTO_MEDALLA = { oro: 'Oro', plata: 'Plata', bronce: 'Bronce' } as const;

function TarjetaResultado({ serie }: { serie: SerieDetalle }) {
  const filas = (serie.resultados ?? []).filter((f) => f.posicion != null).slice(0, 3);
  return (
    <section aria-label={serie.titulo} className={estilos.evento}>
      <div className={estilos.eventoCabecera}>
        <div className={estilos.eventoTextos}>
          <span className={estilos.codigo}>{serie.categoriaGenero}</span>
          <h3 className={estilos.eventoTitulo}>{serie.titulo}</h3>
        </div>
        <EstadoSerieBadge estado={serie.estado} />
      </div>
      {filas.map((f) => (
        <div key={f.bote.inscripcionId} className={estilos.resultadoFila}>
          <span className={estilos.posicion}>{f.posicion}</span>
          <span className={estilos.filaTextos}>
            <span className={estilos.filaTitulo}>{f.bote.nombre}</span>
            <span className={estilos.subtexto}>{f.bote.clubNombre}</span>
          </span>
          <span className={estilos.resultadoExtra}>
            <span className={estilos.mono}>{f.tiempo}</span>
            {serie.esFinal && f.puntos != null && <span>{f.puntos} pts</span>}
            {serie.esFinal && f.medalla && <strong>{TEXTO_MEDALLA[f.medalla]}</strong>}
          </span>
        </div>
      ))}
      <div className={estilos.pie}>
        <Link href={rutas.serie(serie.competenciaId, serie.id)} className={estilos.enlace}>
          Ver resultados completos
        </Link>
      </div>
    </section>
  );
}

function EnVivoYResultados({ competencia }: { competencia: CompetenciaVista }) {
  const vivo = serieEnVivo();
  const publicadas = seriesPublicadas(competencia.id);
  return (
    <>
      {vivo && vivo.competenciaId === competencia.id && <BandaEnVivo serie={vivo} />}
      {publicadas.length === 0 ? (
        <section className={estilos.tarjeta}>
          <Vacio>Todavía no hay resultados publicados.</Vacio>
        </section>
      ) : (
        publicadas.map((s) => <TarjetaResultado key={s.id} serie={s} />)
      )}
    </>
  );
}

function Configuracion({ competencia, eventos }: { competencia: CompetenciaVista; eventos: EventoVista[] }) {
  const config = configuracionFederacion();
  const conAvance = eventos.filter((e) => e.fases.length > 1);
  return (
    <>
      <Tarjeta etiquetaAria="Tabla de puntos de las finales" titulo="Tabla de puntos de las finales">
        <div className={estilos.tarjetaCuerpo}>
          <div className={estilos.campos} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
            {config.tablaPuntos.map((p, i) => (
              <Input key={i} label={`Posición ${i + 1}`} value={String(p)} mono soloLectura />
            ))}
          </div>
          <p className={estilos.nota}>Solo las finales dan puntos. Eliminatorias, repechaje y semifinales, no.</p>
        </div>
      </Tarjeta>

      <Tarjeta etiquetaAria="Avance entre fases" titulo="Avance entre fases">
        <div className={estilos.tarjetaCuerpo}>
          {conAvance.length === 0 ? (
            <p className={estilos.nota}>Los eventos de esta competencia tienen una sola fase.</p>
          ) : (
            conAvance.map((e) => (
              <div key={e.id} className={estilos.regla}>
                <span className={estilos.filaTitulo}>{e.lectura}</span>
                {e.fases
                  .filter((f) => f.avanceTexto)
                  .map((f) => (
                    <span key={f.id} className={estilos.subtexto}>
                      {f.nombre}: {f.avanceTexto}
                    </span>
                  ))}
              </div>
            ))
          )}
        </div>
      </Tarjeta>

      <Tarjeta etiquetaAria="Cierre de inscripciones" titulo="Cierre de inscripciones">
        <div className={estilos.tarjetaCuerpo}>
          {competencia.cierre && (
            <div className={estilos.campos}>
              <Input label="Fecha de cierre" value={formatearFecha(competencia.cierre.fecha, 'larga')} soloLectura />
              <Input label="Hora de cierre" value={`${competencia.cierre.hora} h`} mono soloLectura />
            </div>
          )}
          <p className={estilos.nota}>Las inscripciones se cierran solas en esa fecha.</p>
        </div>
      </Tarjeta>

      <div>
        <AccionNoDisponible icon={Save}>Guardar configuración</AccionNoDisponible>
      </div>
    </>
  );
}

interface Props {
  competencia: CompetenciaVista;
  pestana: IdPestana;
  club?: string;
}

export function CentroCompetencia({ competencia, pestana, club }: Props) {
  const eventos = eventosDeCompetencia(competencia.id);
  const base = rutas.panel.federacion.competencia(competencia.id);
  return (
    <div className={estilos.pagina}>
      <Etapas competencia={competencia} />
      <Tabs
        className={estilos.pestanas}
        value={pestana}
        items={PESTANAS.map((p) => ({ id: p.id, label: p.label, href: armarUrl(base, { pestana: p.id === 'programa' ? undefined : p.id }) }))}
      />
      {pestana === 'programa' && <Programa eventos={eventos} />}
      {pestana === 'inscripciones' && <Inscripciones competencia={competencia} eventos={eventos} club={club} />}
      {pestana === 'series' && <Series eventos={eventos} />}
      {pestana === 'resultados' && <EnVivoYResultados competencia={competencia} />}
      {pestana === 'configuracion' && <Configuracion competencia={competencia} eventos={eventos} />}
    </div>
  );
}
