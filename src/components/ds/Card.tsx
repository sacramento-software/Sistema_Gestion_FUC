import Link from 'next/link';
import type { CSSProperties, KeyboardEvent, MouseEventHandler, ReactNode } from 'react';
import { cx } from './cx';
import { Filete } from './Filete';
import estilos from './Card.module.css';

export interface CardProps {
  filete?: boolean;
  padding?: number;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ filete = false, padding = 20, onClick, href, children, className, style }: CardProps) {
  const contenido = (
    <>
      {filete && <Filete />}
      <div style={{ padding }}>{children}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cx(estilos.tarjeta, estilos.interactiva, className)} style={style} onClick={onClick}>
        {contenido}
      </Link>
    );
  }

  if (onClick) {
    const alTeclear = (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
      }
    };
    return (
      <div
        role="button"
        tabIndex={0}
        className={cx(estilos.tarjeta, estilos.interactiva, className)}
        style={style}
        onClick={onClick}
        onKeyDown={alTeclear}
      >
        {contenido}
      </div>
    );
  }

  return (
    <div className={cx(estilos.tarjeta, className)} style={style}>
      {contenido}
    </div>
  );
}
