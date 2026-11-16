import type { ReactNode } from 'react';
import estilos from './FilaChips.module.css';

export interface FilaChipsProps {
  /** Nombre del grupo de filtros, para lectores de pantalla. */
  etiqueta: string;
  children: ReactNode;
}

/** Fila de chips de filtro con desplazamiento propio en el celular. */
export function FilaChips({ etiqueta, children }: FilaChipsProps) {
  return (
    <nav aria-label={etiqueta} className={estilos.fila}>
      {children}
    </nav>
  );
}
