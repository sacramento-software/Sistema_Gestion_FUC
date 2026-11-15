import type { ReactNode } from 'react';
import estilos from './EncabezadoPagina.module.css';

export interface EncabezadoPaginaProps {
  titulo: string;
  bajada?: ReactNode;
}

/** Título de página público: barra celeste inclinada, título en mayúsculas y bajada de una línea. */
export function EncabezadoPagina({ titulo, bajada }: EncabezadoPaginaProps) {
  return (
    <header className={estilos.encabezado}>
      <h1 className={estilos.titulo}>
        <span aria-hidden="true" className={estilos.barra} />
        {titulo}
      </h1>
      {bajada && <p className={estilos.bajada}>{bajada}</p>}
    </header>
  );
}
