import Link from 'next/link';
import { ArrowDown, ArrowUp, Check, CircleCheck, Lock, Pencil, Plus, X } from 'lucide-react';
import { CategoryTag, EstadoSerieBadge, Filete, Icon } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import type { ArmadoDeFase, BoteVista, EventoVista, SerieDetalle } from '@/datos';
import { rutas } from '@/lib/rutas';
import { Barra, Etiqueta, NumeroCarril, TarjetaJuez } from './Bloques';
import { SelectorEvento } from './SelectorEvento';
import estilos from './juez.module.css';
import tablas from './tablas.module.css';
import disposicion from './disposicion.module.css';

interface Props {
  eventos: EventoVista[];
  armado: ArmadoDeFase;
  serie: SerieDetalle | null;
}

const TEXTO_ESTADO: Record<SerieDetalle['estado'], string> = {
  armada: 'armada',
  'en-vivo': 'en vivo',
  terminada: 'terminada',
  publicada: 'publicada',
};

function urlArmado(eventoId: string, faseId?: string, serieId?: string): string {
  const q = new URLSearchParams({ evento: eventoId });
  if (faseId) q.set('fase', faseId);
  if (serieId) q.set('serie', serieId);
  return `${rutas.panel.juez.armado()}?${q.toString()}`;
}

function textoBotes(n: number): string {
  return n === 1 ? '1 bote' : `${n} botes`;
}

function NombresDeBote({ bote }: { bote: BoteVista }) {
  return (
    <span className={disposicion.disponiblesBote}>
      {bote.deportistas.map((d) => (
        <span key={d.id} style={{ fontWeight: 600 }}>
          {d.nombreCompleto}
        </span>
      ))}
    </span>
  );
}

export function ArmadoVista({ eventos, armado, serie }: Props) {
  const { evento, fase, fasesDelEvento, series, disponibles, inscriptos, botesConCarril, botesTotales } = armado;
  const sinSeries = series.length === 0;
  const totalDisponibles = disponibles.reduce((n, g) => n + g.botes.length, 0);
  const conInscriptos = inscriptos.length > 0;
  const crearSerie = (
    <AccionNoDisponible icon={Plus}>
      Crear serie
    </AccionNoDisponible>
  );

  return (
    <div className={estilos.pagina}>
      <div className={disposicion.selectores}>
        <SelectorEvento
          eventos={eventos.map((e) => ({ value: e.id, label: e.lectura }))}
          valor={evento.id}
          base={rutas.panel.juez.armado()}
        />
        <div className={disposicion.filaChips} role="group" aria-label="Fases del evento">
          {fasesDelEvento.map((f) => (
            <CategoryTag key={f.id} href={urlArmado(evento.id, f.id)} seleccionado={f.id === fase.id}>
              {f.nombre}
              {f.prevista ? ' · Prevista' : ''}
            </CategoryTag>
          ))}
        </div>
      </div>

      <div className={disposicion.cabeceraEvento}>
        <div className={disposicion.cabeceraEventoTextos}>
          <Etiqueta>
            Evento · {evento.botesInscriptos} botes inscriptos · {evento.clubesInscriptos} clubes
          </Etiqueta>
          <h3 className={disposicion.tituloEvento}>
            {fase.nombre} · {evento.embarcacion} {evento.distancia} m
          </h3>
          <span className={disposicion.lineaCategoria}>
            {evento.categoriaGenero}
            <CategoryTag>{evento.codigo}</CategoryTag>
          </span>
        </div>
        <div className={disposicion.contador}>
          <span className={disposicion.contadorNumero}>
            {botesConCarril}
            <span style={{ color: 'var(--color-texto-sec)' }}> / {botesTotales}</span>
          </span>
          <span className={estilos.subtexto}>botes con carril</span>
        </div>
      </div>

      {!sinSeries && (
        <div className={disposicion.filaChips}>
          {series.map((s) => {
            const activa = serie?.id === s.id;
            return (
              <Link
                key={s.id}
                href={urlArmado(evento.id, fase.id, s.id)}
                aria-current={activa ? 'true' : undefined}
                className={`${disposicion.chipSerie} ${activa ? disposicion.chipActivo : ''}`}
              >
                <span className={disposicion.chipNombre}>
                  {s.nombre}
                  <span style={{ display: 'flex', color: 'var(--color-exito)' }}>
                    <Icon icono={CircleCheck} size={16} />
                  </span>
                </span>
                <span className={disposicion.chipSub}>
                  {s.cantidadCarriles} carriles · {TEXTO_ESTADO[s.estado]}
                </span>
              </Link>
            );
          })}
          {crearSerie}
        </div>
      )}

      <div className={disposicion.armadoGrid}>
        <div className={disposicion.columna}>
          {sinSeries ? (
            <div className={estilos.tarjeta} style={{ padding: 20 }}>
              <div className={estilos.nombreDoble} style={{ gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Todavía no hay series para esta fase.</span>
                <AccionNoDisponible icon={Plus}>Crear serie</AccionNoDisponible>
              </div>
            </div>
          ) : (
            serie && <SerieActiva serie={serie} />
          )}

          {conInscriptos && (
            <TarjetaJuez etiquetaAria="Inscriptos" titulo="Inscriptos" meta={textoBotes(inscriptos.length)}>
              {inscriptos.map((i) => {
                const lugar = i.serieId ? series.find((s) => s.id === i.serieId) : undefined;
                return (
                  <div key={i.bote.inscripcionId} className={disposicion.inscripto}>
                    <span className={estilos.nombreDoble}>
                      <span className={estilos.nombre}>{i.bote.nombre}</span>
                      <span className={estilos.subtexto}>{i.bote.clubNombre}</span>
                    </span>
                    <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                      {i.clasificado && (
                        <span className={disposicion.pildora}>
                          <Icon icono={Check} size={14} />
                          Clasificado
                        </span>
                      )}
                      {lugar && i.carril && (
                        <span className={disposicion.ubicacion}>
                          {lugar.nombre} · carril {i.carril}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </TarjetaJuez>
          )}
        </div>

        {!sinSeries && (
          <section aria-label="Botes disponibles" className={estilos.tarjeta}>
            <Filete />
            <div className={disposicion.disponiblesCabecera}>
              <h4 className={estilos.tarjetaTitulo} style={{ fontSize: 22 }}>
                Disponibles
              </h4>
              <Etiqueta>{textoBotes(totalDisponibles)}</Etiqueta>
            </div>
            {disponibles.map((g) => (
              <div key={g.clubId} className={disposicion.disponiblesGrupo}>
                <div className={disposicion.disponiblesClub}>
                  <span>{g.clubNombre}</span>
                  <span className={estilos.mono} style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-texto-sec)' }}>
                    {textoBotes(g.botes.length)}
                  </span>
                </div>
                {g.botes.map((b) => (
                  <AccionNoDisponible
                    key={b.inscripcionId}
                    variant="secundario"
                    fullWidth
                    style={{ height: 'auto', minHeight: 60, justifyContent: 'flex-start', padding: '8px 12px' }}
                  >
                    <NombresDeBote bote={b} />
                  </AccionNoDisponible>
                ))}
              </div>
            ))}
            {totalDisponibles === 0 && (
              <div className={disposicion.vacio}>
                <strong>No quedan botes disponibles.</strong> Todos los inscriptos tienen carril en alguna serie.
              </div>
            )}
            <div className={estilos.notas} style={{ background: 'var(--color-superficie-2)', padding: '12px 16px' }}>
              Tocá un bote para ubicarlo en el primer carril libre. Cada K2 se ubica como una unidad; los que ya tienen
              carril salen de esta lista.
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SerieActiva({ serie }: { serie: SerieDetalle }) {
  const n = serie.carriles.length;
  const armada = serie.estado === 'armada';
  const total = serie.cantidadCarriles;
  return (
    <section aria-label="Serie activa" className={estilos.tarjeta}>
      <Filete />
      <div className={estilos.tarjetaCabecera} style={{ alignItems: 'flex-start' }}>
        <div className={estilos.nombreDoble} style={{ gap: 6 }}>
          <h4 className={estilos.tarjetaTitulo} style={{ fontSize: 24 }}>
            {serie.nombre} · {serie.evento.embarcacion} {serie.evento.distancia} m
          </h4>
          <Etiqueta>
            {total} carriles · {n} de {total} con bote
          </Etiqueta>
        </div>
        <EstadoSerieBadge estado={serie.estado} />
      </div>
      <div className={disposicion.franja}>
        <span className={disposicion.franjaIcono}>
          <Icon icono={Lock} size={18} />
        </span>
        <span>
          {armada
            ? 'Serie armada. Ya figura en la consola de carrera con este orden de carriles.'
            : 'Esta serie ya largó. Su armado no se puede cambiar.'}
        </span>
      </div>
      <div className={`${estilos.encabezadoTabla} ${tablas.armado}`}>
        <span className={tablas.aN}>Carril</span>
        <span className={tablas.aSel}>Bote · club</span>
        <span className={tablas.aOrd}>Orden</span>
      </div>
      {serie.carriles.map((c, i) => (
        <div key={c.numero} className={`${estilos.fila} ${tablas.armado}`} style={{ minHeight: 64 }}>
          <span className={tablas.aN}>
            <NumeroCarril n={c.numero} />
          </span>
          <span className={tablas.aSel}>
            <span className={estilos.nombre}>{c.bote.nombre}</span>
            <span className={estilos.subtexto}>
              {c.bote.clubNombre}
            </span>
          </span>
          <span className={tablas.aOrd}>
            <AccionNoDisponible
              variant="icono"
              icon={ArrowUp}
              label={i > 0 ? `Subir al carril ${serie.carriles[i - 1].numero}` : 'Subir'}
            />
            <AccionNoDisponible
              variant="icono"
              icon={ArrowDown}
              label={i < n - 1 ? `Bajar al carril ${serie.carriles[i + 1].numero}` : 'Bajar'}
            />
            <AccionNoDisponible variant="icono" icon={X} label={`Dejar libre el carril ${c.numero}`} />
          </span>
        </div>
      ))}
      <div className={estilos.pie}>
        <div className={estilos.progresoBloque}>
          <span className={estilos.progresoTitulo}>
            {n} de {total} carriles con bote
          </span>
          <Barra valor={n} total={total} />
          <span className={estilos.pieTexto} style={{ flex: 'none' }}>
            {armada
              ? 'Serie armada. Para cambiar un carril, tocá «Editar armado».'
              : 'Esta serie ya largó. Su armado no se puede cambiar.'}
          </span>
        </div>
        {armada && (
          <AccionNoDisponible variant="secundario" icon={Pencil}>
            Editar armado
          </AccionNoDisponible>
        )}
      </div>
    </section>
  );
}
