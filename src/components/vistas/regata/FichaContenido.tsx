import Link from 'next/link';
import { CategoryTag } from '@/components/ds/CategoryTag';
import { cx } from '@/components/ds/cx';
import { StatusBadge, type EstadoCompetencia } from '@/components/ds/StatusBadge';
import { Time } from '@/components/ds/Time';
import type { FichaDeportista } from '@/datos';
import { anioTemporada } from '@/dominio';
import { rutas } from '@/lib/rutas';
import base from './base.module.css';
import estilos from './FichaContenido.module.css';
import { Medalla } from './Medalla';

const ESTADO_CAMPEONATO: Record<
  FichaDeportista['campeonatos'][number]['estado'],
  { estado: EstadoCompetencia; texto: string }
> = {
  finalizado: { estado: 'finalizada', texto: 'Finalizado' },
  'en-curso': { estado: 'curso', texto: 'En curso' },
  proximo: { estado: 'cerradas', texto: 'Próximo' },
};

export interface FichaContenidoProps {
  ficha: FichaDeportista;
  /** A dónde lleva un compañero de tripulación (cambia `?deportista` o abre su página). */
  hrefDeportista: (deportistaId: string) => string;
  /** `pagina`: dos columnas en escritorio; `panel`: una sola columna. */
  variante: 'panel' | 'pagina';
  /** Nivel del nombre: `h1` en la página propia, `h2` dentro del panel. */
  Titulo?: 'h1' | 'h2';
}

/** Contenido de la ficha del deportista, igual en el panel desplegable y en la página propia. */
export function FichaContenido({ ficha, hrefDeportista, variante, Titulo = 'h2' }: FichaContenidoProps) {
  const { deportista } = ficha;
  const anio = anioTemporada();
  const conBotesGrandes = ficha.embarcaciones.some((e) => e === 'K2' || e === 'K4');

  return (
    <div className={cx(estilos.ficha, variante === 'pagina' && estilos.pagina)}>
      <div className={estilos.columna}>
        <div className={estilos.identidad}>
          <span className={base.rotulo}>Deportista</span>
          <Titulo className={estilos.nombre}>{deportista.nombreCompleto}</Titulo>
          <span className={estilos.club}>{deportista.clubNombre}</span>
          <div className={estilos.etiquetas}>
            {ficha.embarcaciones.map((e) => (
              <CategoryTag key={e}>{e}</CategoryTag>
            ))}
            <CategoryTag>{`${deportista.categoriaTexto} · ${deportista.sexoTexto}`}</CategoryTag>
          </div>
          {ficha.tripulaciones.map((t) => (
            <p key={t.eventoLectura} className={estilos.tripulacion}>
              <span className={base.rotulo}>Tripulación</span>
              <span>
                {t.eventoLectura} con{' '}
                {t.companeros.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && (i === t.companeros.length - 1 ? ' y ' : ', ')}
                    <Link href={hrefDeportista(c.id)} scroll={false} className={estilos.enlace}>
                      {c.nombreCompleto}
                    </Link>
                  </span>
                ))}
              </span>
            </p>
          ))}
        </div>

        <section aria-label="Mejores tiempos" className={estilos.seccion}>
          <h3 className={estilos.titulo}>Mejor tiempo por distancia</h3>
          {ficha.mejoresTiempos.map((m) => (
            <Link
              key={m.etiqueta}
              href={rutas.serie(m.competenciaId, m.serieId)}
              className={cx(estilos.fila, estilos.filaMejor)}
            >
              <span className={estilos.textos}>
                <span className={estilos.etiqueta}>{m.etiqueta}</span>
                <span className={estilos.secundario}>{m.contexto}</span>
              </span>
              <Time valor={m.tiempo} tamano="l" />
            </Link>
          ))}
        </section>
      </div>

      <div className={estilos.columna}>
        <section aria-label="Últimas carreras" className={estilos.seccion}>
          <h3 className={estilos.titulo}>Últimas 5 carreras</h3>
          <div className={cx(estilos.encabezadoTabla, estilos.gridCarreras)} aria-hidden="true">
            <span>Carrera</span>
            <span>Pos</span>
            <span className={estilos.derecha}>Tiempo</span>
          </div>
          {ficha.ultimasCarreras.map((c) => (
            <Link
              key={`${c.serieId}-${c.titulo}`}
              href={rutas.serie(c.competenciaId, c.serieId)}
              className={cx(estilos.fila, estilos.gridCarreras)}
            >
              <span className={estilos.textos}>
                <span className={estilos.carrera}>{c.titulo}</span>
                <span className={estilos.secundario}>
                  {c.competenciaNombre} · {c.fechaTexto}
                </span>
              </span>
              <span className={cx(estilos.posicion, c.posicion == null && estilos.apagado)}>
                {c.posicion ?? '—'}
                {c.esFinal && <Medalla medalla={c.medalla} />}
              </span>
              <span className={estilos.derecha}>
                {c.tiempo ? <Time valor={c.tiempo} /> : <Time valor={c.codigo ?? '—'} apagado />}
              </span>
            </Link>
          ))}
        </section>

        <section aria-label="Campeonatos" className={estilos.seccion}>
          <h3 className={estilos.titulo}>Campeonatos {anio}</h3>
          <div className={cx(estilos.encabezadoTabla, estilos.gridCampeonatos)} aria-hidden="true">
            <span>Campeonato</span>
            <span>Pos</span>
            <span className={estilos.derecha}>Pts</span>
          </div>
          {ficha.campeonatos.map((c) => {
            const estado = ESTADO_CAMPEONATO[c.estado];
            return (
              <div key={`${c.tipo}-${c.nombre}`} className={cx(estilos.filaFija, estilos.gridCampeonatos)}>
                <span className={estilos.textos}>
                  <span className={estilos.carrera}>{c.nombre}</span>
                  <span className={estilos.estadoCampeonato}>
                    <StatusBadge estado={estado.estado}>{estado.texto}</StatusBadge>
                    <span className={estilos.secundario}>{c.fechasTexto}</span>
                  </span>
                </span>
                <span className={cx(estilos.posicion, c.posicion == null && estilos.apagado)}>{c.posicion ?? '—'}</span>
                <span className={cx(estilos.posicion, estilos.derecha, c.puntos == null && estilos.apagado)}>
                  {c.puntos ?? '—'}
                </span>
              </div>
            );
          })}
          <p className={estilos.nota}>
            Posición y puntos acumulados en su categoría.
            {conBotesGrandes && ' En K2 y K4, los puntos del bote cuentan para cada integrante.'}
          </p>
        </section>
      </div>
    </div>
  );
}
