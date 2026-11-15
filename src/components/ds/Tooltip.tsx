'use client';

import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from './cx';
import estilos from './Tooltip.module.css';

export interface TooltipProps {
  texto: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Se muestra con el mouse y con el foco del teclado. */
export function Tooltip({ texto, children, className, style }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <span
      className={cx(estilos.contenedor, className)}
      style={style}
      aria-describedby={visible ? id : undefined}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span role="tooltip" id={id} className={estilos.globo}>
          {texto}
        </span>
      )}
    </span>
  );
}
