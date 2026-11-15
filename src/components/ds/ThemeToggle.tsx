'use client';

import type { CSSProperties } from 'react';
import type { Tema } from '@/lib/tema-cookie';
import { cx } from './cx';
import estilos from './ThemeToggle.module.css';

export interface ThemeToggleProps {
  tema?: Tema;
  onToggle?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** Solo presentación: el círculo mitad lleno. El que se usa en las cáscaras es `SelectorTema`. */
export function ThemeToggle({ tema = 'claro', onToggle, className, style }: ThemeToggleProps) {
  const noche = tema === 'noche';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={noche ? 'Cambiar a modo claro' : 'Cambiar a modo noche'}
      title={noche ? 'Modo claro' : 'Modo noche'}
      className={cx(estilos.boton, className)}
      style={style}
    >
      <span className={cx(estilos.circulo, noche && estilos.noche)}>
        <span className={estilos.mitad} />
      </span>
    </button>
  );
}
