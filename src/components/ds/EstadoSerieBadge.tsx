import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';
import { PuntoEnVivo } from './PuntoEnVivo';
import estilos from './StatusBadge.module.css';

export type EstadoSerie = 'armada' | 'en-vivo' | 'terminada' | 'publicada';

const TEXTOS: Record<EstadoSerie, string> = {
  armada: 'Armada',
  'en-vivo': 'En vivo',
  terminada: 'Terminada',
  publicada: 'Publicada',
};

// Cada estado de la serie reutiliza los colores de un estado de competencia.
const CLASES: Record<EstadoSerie, string> = {
  armada: estilos.cerradas,
  'en-vivo': estilos.curso,
  terminada: estilos.finalizada,
  publicada: estilos.abiertas,
};

export interface EstadoSerieBadgeProps {
  estado: EstadoSerie;
  /** Reemplaza el texto por defecto (P5 muestra «Resultados en revisión»). */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function EstadoSerieBadge({ estado, children, className, style }: EstadoSerieBadgeProps) {
  return (
    <span className={cx(estilos.insignia, CLASES[estado], className)} style={style}>
      {estado === 'en-vivo' && <PuntoEnVivo tamano={8} />}
      {children || TEXTOS[estado]}
    </span>
  );
}
