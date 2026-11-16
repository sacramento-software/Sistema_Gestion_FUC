import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/components/ds/cx';
import estilos from './Contenedor.module.css';

export interface ContenedorProps {
  ancho?: 'normal' | 'amplio';
  as?: 'div' | 'section' | 'main';
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Centra el contenido con ancho máximo de 1200 px (normal) o 1320 px (amplio). */
export function Contenedor({ ancho = 'normal', as: Etiqueta = 'div', children, className, style }: ContenedorProps) {
  return (
    <Etiqueta className={cx(estilos.contenedor, ancho === 'amplio' && estilos.amplio, className)} style={style}>
      {children}
    </Etiqueta>
  );
}
