import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Contenedor } from '@/components/cascaras';
import { EstadoSerieBadge, Icon, PhaseTrack, PuntoEnVivo } from '@/components/ds';
import {
  inscripcionesDeEvento,
  obtenerCompetencia,
  obtenerEvento,
  obtenerSerie,
  type BoteVista,
  type EventoVista,
  type FilaResultado,
} from '@/datos';
import { formatearFecha } from '@/dominio';
import { rutas } from '@/lib/rutas';
import estilos from './evento.module.css';
import comunes from '@/components/vistas/publico-resto/Paginas.module.css';

type Params = { competenciaId: string; eventoId: string };

const ESTADO_EVENTO: Record<EventoVista['estado'], string> = {
  programado: 'Programado',
  'en-vivo': 'En vivo',
  finalizado: 'Finalizado',
};

const COLOR_MEDALLA = {
  oro: 'var(--medalla-oro)',
  plata: 'var(--medalla-plata)',
  bronce: 'var(--medalla-bronce)',
} as const;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { competenciaId, eventoId } = await params;
  const evento = obtenerEvento(eventoId);
  return evento && evento.competenciaId === competenciaId ? { title: evento.lectura } : {};
}

/** Los 3 primeros de una serie, solo si está publicada (el público no ve tiempos antes). */
function primerosTres(serieId: string, estado: string): FilaResultado[] {
  if (estado !== 'publicada') return [];
  return (obtenerSerie(serieId)?.resultados ?? []).filter((f) => f.posicion !== null).slice(0, 3);
}

/** Inscriptos agrupados por club, en el orden en que los devuelve la consulta. */
function porClub(botes: BoteVista[]): { clubId: string; clubNombre: string; botes: BoteVista[] }[] {
  const grupos = new Map<string, { clubId: string; clubNombre: string; botes: BoteVista[] }>();
  for (const bote of botes) {
    const grupo = grupos.get(bote.clubId) ?? { clubId: bote.clubId, clubNombre: bote.clubNombre, botes: [] };
    grupo.botes.push(bote);
    grupos.set(bote.clubId, grupo);
  }
  return [...grupos.values()];
}

export default async function EventoPage({ params }: { params: Promise<Params> }) {
  const { competenciaId, eventoId } = await params;
  const evento = obtenerEvento(eventoId);
  const competencia = obtenerCompetencia(competenciaId);
  if (!evento || !competencia || evento.competenciaId !== competenciaId) notFound();

  const enVivo = evento.fases.findIndex((f) => f.series.some((s) => s.estado === 'en-vivo'));
  const ultimaPublicada = evento.fases.findLastIndex((f) => f.series.some((s) => s.estado === 'publicada'));
  const actual = enVivo >= 0 ? enVivo : Math.max(ultimaPublicada, 0);

  const clubes = porClub(inscripcionesDeEvento(evento.id));

  return (
    <Contenedor ancho="amplio" as="main" className={comunes.pagina}>
      <Link href={rutas.competencia(competencia.id)} className={comunes.volver}>
        <Icon icono={ChevronLeft} size={20} />
        {competencia.nombre}
      </Link>

      <header className={estilos.encabezado}>
        <span className={comunes.rotulo}>{evento.codigo}</span>
        <h1 className={estilos.titulo}>{evento.lectura}</h1>
        <p className={estilos.meta}>
          <span>
            {evento.botesInscriptos} botes · {evento.clubesInscriptos} clubes
          </span>
          <span className={estilos.estado}>
            {evento.estado === 'en-vivo' && <PuntoEnVivo />}
            {ESTADO_EVENTO[evento.estado]}
          </span>
        </p>
      </header>

      <PhaseTrack fases={evento.fases.map((f) => f.nombre)} actual={actual} />

      <div className={estilos.fases}>
        {evento.fases.map((fase) => (
          <section key={fase.id} className={estilos.fase} aria-labelledby={`fase-${fase.id}`}>
            <h2 id={`fase-${fase.id}`} className={estilos.faseTitulo}>
              {fase.nombre}
            </h2>
            <p className={estilos.faseHora}>
              {formatearFecha(fase.fecha, 'dia')} · {fase.horaTexto}
            </p>
            {fase.avanceTexto && (
              <p className={estilos.avance}>
                <Icon icono={Flag} size={16} />
                {fase.avanceTexto}
              </p>
            )}
            {fase.series.length === 0 ? (
              <p className={estilos.prevista}>Las series se arman cuando termine la fase anterior.</p>
            ) : (
              <ul className={estilos.series}>
                {fase.series.map((serie) => {
                  const filas = primerosTres(serie.id, serie.estado);
                  return (
                    <li key={serie.id}>
                      <Link href={rutas.serie(competencia.id, serie.id)} className={estilos.serie}>
                        <span className={estilos.serieCabecera}>
                          <span className={estilos.serieTexto}>
                            <span className={comunes.filaTitulo}>{serie.nombre}</span>
                            <span className={comunes.filaDetalle}>
                              {serie.horaTexto} · {serie.cantidadCarriles} carriles
                            </span>
                          </span>
                          <EstadoSerieBadge estado={serie.estado} />
                          <Icon icono={ChevronRight} size={20} className={comunes.chevron} />
                        </span>
                        {filas.length > 0 && (
                          <ol className={estilos.podio}>
                            {filas.map((f) => (
                              <li key={f.bote.inscripcionId} className={estilos.puesto}>
                                <span className={estilos.posicion}>
                                  {serie.esFinal && f.medalla && (
                                    <span
                                      role="img"
                                      aria-label={`Puesto ${f.posicion}`}
                                      className={estilos.medalla}
                                      style={{ background: COLOR_MEDALLA[f.medalla] }}
                                    />
                                  )}
                                  {f.posicion}
                                </span>
                                <span className={estilos.puestoTexto}>
                                  <span className={comunes.filaTitulo}>{f.bote.nombre}</span>
                                  <span className={comunes.filaDetalle}>{f.bote.clubNombre}</span>
                                </span>
                                <span className={estilos.puestoDatos}>
                                  <span className={estilos.tiempo}>{f.tiempo ?? f.codigo}</span>
                                  {serie.esFinal && f.puntos !== null && (
                                    <span className={comunes.filaDetalle}>{f.puntos} pts</span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className={comunes.seccion} aria-labelledby="inscriptos">
        <h2 id="inscriptos" className={comunes.seccionTitulo}>
          Inscriptos
        </h2>
        <div className={estilos.clubes}>
          {clubes.map((club) => (
            <div key={club.clubId} className={estilos.club}>
              <h3 className={estilos.clubNombre}>{club.clubNombre}</h3>
              <ul className={estilos.botes}>
                {club.botes.map((bote) => (
                  <li key={bote.inscripcionId} className={estilos.bote}>
                    <span className={comunes.filaTitulo}>{bote.nombre}</span>
                    <span className={comunes.rotulo}>
                      {bote.embarcacion} · Bote {bote.numero}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Contenedor>
  );
}
