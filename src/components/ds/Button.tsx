import Link from 'next/link';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from './cx';
import { Icon } from './Icon';
import estilos from './Button.module.css';

export interface ButtonProps {
  variant?: 'primario' | 'secundario' | 'terciario' | 'peligro';
  size?: 'md' | 'sm';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: 'button' | 'submit' | 'reset';
  /** Si viene, se renderiza como enlace con el mismo aspecto. */
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export function Button({
  variant = 'primario',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  iconRight,
  children,
  onClick,
  type = 'button',
  href,
  className,
  style,
}: ButtonProps) {
  const clase = cx(estilos.boton, estilos[variant], estilos[size], fullWidth && estilos.completo, className);
  const contenido = (
    <>
      {icon && <Icon icono={icon} size={18} />}
      {children}
      {iconRight && <Icon icono={iconRight} size={18} />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={clase} style={style} onClick={onClick}>
        {contenido}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={clase} style={style}>
      {contenido}
    </button>
  );
}
