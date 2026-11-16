import Link from 'next/link';
import type { CSSProperties, MouseEventHandler } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from './cx';
import { Icon } from './Icon';
import estilos from './IconButton.module.css';

export interface IconButtonProps {
  icon: LucideIcon;
  /** Obligatorio: es el nombre accesible del botón. */
  label: string;
  variant?: 'neutro' | 'borde';
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export function IconButton({
  icon,
  label,
  variant = 'neutro',
  onClick,
  disabled = false,
  href,
  className,
  style,
}: IconButtonProps) {
  const clase = cx(estilos.boton, variant === 'borde' && estilos.borde, className);
  const contenido = <Icon icono={icon} size={22} />;

  if (href && !disabled) {
    return (
      <Link href={href} className={clase} style={style} aria-label={label} title={label} onClick={onClick}>
        {contenido}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={clase}
      style={style}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {contenido}
    </button>
  );
}
