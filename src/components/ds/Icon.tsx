import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from './cx';
import estilos from './Icon.module.css';

export interface IconProps {
  icono: LucideIcon;
  size?: number;
  color?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ icono: Glifo, size = 20, color = 'currentColor', label, className, style }: IconProps) {
  return (
    <span
      className={cx(estilos.icono, className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ width: size, height: size, color, ...style }}
    >
      <Glifo size={size} strokeWidth={2} aria-hidden="true" focusable="false" />
    </span>
  );
}
