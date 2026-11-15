import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './PuntoEnVivo.module.css';

export interface PuntoEnVivoProps {
  tamano?: number;
  className?: string;
  style?: CSSProperties;
}

/** Punto rojo que late: marca lo que está pasando en vivo. */
export function PuntoEnVivo({ tamano = 9, className, style }: PuntoEnVivoProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(estilos.punto, className)}
      style={{ width: tamano, height: tamano, ...style }}
    />
  );
}
