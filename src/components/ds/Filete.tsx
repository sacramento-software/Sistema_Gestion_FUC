import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './Filete.module.css';

export interface FileteProps {
  className?: string;
  style?: CSSProperties;
}

/** Filete doble: 3 px de acción y 3 px de celeste. */
export function Filete({ className, style }: FileteProps) {
  return (
    <div aria-hidden="true" className={cx(estilos.filete, className)} style={style}>
      <div className={estilos.uno} />
      <div className={estilos.dos} />
    </div>
  );
}
