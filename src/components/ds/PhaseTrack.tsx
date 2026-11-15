import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './PhaseTrack.module.css';

export interface PhaseTrackProps {
  fases?: string[];
  actual?: number;
  className?: string;
  style?: CSSProperties;
}

export function PhaseTrack({
  fases = ['Inscripción', 'Series', 'Semifinales', 'Final'],
  actual = 0,
  className,
  style,
}: PhaseTrackProps) {
  return (
    <ol
      className={cx(estilos.pista, className)}
      style={{ gridTemplateColumns: `repeat(${fases.length}, minmax(0, 1fr))`, ...style }}
    >
      {fases.map((fase, i) => {
        const hecha = i < actual;
        const actualActiva = i === actual;
        return (
          <li key={fase} className={estilos.fase} aria-current={actualActiva ? 'step' : undefined}>
            <div className={cx(estilos.barra, actualActiva && estilos.barraActual, (hecha || actualActiva) && estilos.barraLlena)} />
            <div className={estilos.texto}>
              <span className={estilos.numero}>{String(i + 1).padStart(2, '0')}</span>
              <span className={cx(estilos.nombre, actualActiva && estilos.nombreActual, (hecha || actualActiva) && estilos.nombreLleno)}>
                {fase}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
