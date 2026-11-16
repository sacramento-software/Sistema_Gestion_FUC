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

/** Interruptor con una lunita: apagado (barra gris) es modo claro; encendido, modo noche. */
export function ThemeToggle({ tema = 'claro', onToggle, className, style }: ThemeToggleProps) {
  const noche = tema === 'noche';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={noche}
      onClick={onToggle}
      aria-label="Modo noche"
      title={noche ? 'Modo claro' : 'Modo noche'}
      className={cx(estilos.boton, className)}
      style={style}
    >
      <span className={cx(estilos.barra, noche && estilos.activa)}>
        <span className={estilos.perilla}>
          <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" fill="currentColor">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
