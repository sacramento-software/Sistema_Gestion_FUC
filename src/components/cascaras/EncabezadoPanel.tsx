import type { ReactNode } from 'react';
import estilos from './EncabezadoPanel.module.css';

export interface EncabezadoPanelProps {
  titulo: string;
  subtitulo?: string;
  acciones?: ReactNode;
}

/** Banda de título de cada vista del panel. Ocupa el ancho completo del `main`. */
export function EncabezadoPanel({ titulo, subtitulo, acciones }: EncabezadoPanelProps) {
  return (
    <div className={estilos.banda} data-ancho-completo>
      <div className={estilos.textos}>
        <h1 className={estilos.titulo}>{titulo}</h1>
        {subtitulo && <span className={estilos.subtitulo}>{subtitulo}</span>}
      </div>
      {acciones && <div className={estilos.acciones}>{acciones}</div>}
    </div>
  );
}
