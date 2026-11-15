import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './Time.module.css';

const TAMANOS = { xl: 48, l: 28, m: 18 } as const;

export interface TimeProps {
  /** Texto ya formateado (m:ss.cc). */
  valor: string;
  diferencia?: string;
  tamano?: 'xl' | 'l' | 'm';
  apagado?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Time({ valor, diferencia, tamano = 'm', apagado = false, className, style }: TimeProps) {
  const px = TAMANOS[tamano] ?? 18;
  return (
    <span className={cx(estilos.tiempo, className)} style={style}>
      <span className={cx(estilos.valor, apagado && estilos.apagado)} style={{ fontSize: px }}>
        {valor}
      </span>
      {diferencia && (
        <span className={estilos.diferencia} style={{ fontSize: Math.max(12, Math.round(px * 0.6)) }}>
          {diferencia}
        </span>
      )}
    </span>
  );
}
