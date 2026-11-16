import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';
import estilos from './StatusBadge.module.css';

export type EstadoCompetencia = 'abiertas' | 'cerradas' | 'curso' | 'finalizada';

const TEXTOS: Record<EstadoCompetencia, string> = {
  abiertas: 'Inscripciones abiertas',
  cerradas: 'Inscripciones cerradas',
  curso: 'En curso',
  finalizada: 'Finalizada',
};

export interface StatusBadgeProps {
  estado?: EstadoCompetencia;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function StatusBadge({ estado = 'abiertas', children, className, style }: StatusBadgeProps) {
  const clave = TEXTOS[estado] ? estado : 'abiertas';
  return (
    <span className={cx(estilos.insignia, estilos[clave], className)} style={style}>
      {clave === 'curso' && <span className={estilos.punto} aria-hidden="true" />}
      {children || TEXTOS[clave]}
    </span>
  );
}
