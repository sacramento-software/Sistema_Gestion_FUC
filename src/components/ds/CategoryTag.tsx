import Link from 'next/link';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { cx } from './cx';
import estilos from './CategoryTag.module.css';

export interface CategoryTagProps {
  children: ReactNode;
  seleccionado?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Filtros por URL: el chip es un enlace. */
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export function CategoryTag({ children, seleccionado = false, onClick, href, className, style }: CategoryTagProps) {
  const interactivo = Boolean(onClick || href);
  const clase = cx(
    estilos.chip,
    interactivo && estilos.interactivo,
    seleccionado && estilos.seleccionado,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={clase} style={style} aria-current={seleccionado ? 'true' : undefined} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={clase} style={style} aria-pressed={seleccionado} onClick={onClick}>
        {children}
      </button>
    );
  }
  return (
    <span className={clase} style={style}>
      {children}
    </span>
  );
}
