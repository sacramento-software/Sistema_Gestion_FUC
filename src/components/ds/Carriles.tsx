import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './Carriles.module.css';

export interface CarrilesProps {
  cantidad?: number;
  destacado?: number;
  alto?: number;
  tono?: 'noche' | 'claro';
  numeros?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Motivo de carriles: líneas finas numeradas con un carril destacado. */
export function Carriles({
  cantidad = 9,
  destacado = 4,
  alto = 30,
  tono = 'noche',
  numeros = true,
  className,
  style,
}: CarrilesProps) {
  const carriles = Array.from({ length: cantidad }, (_, i) => i + 1);
  return (
    <div aria-hidden="true" className={cx(estilos.carriles, tono === 'noche' ? estilos.noche : estilos.claro, className)} style={style}>
      {carriles.map((n) => {
        const activo = n === destacado;
        return (
          <div key={n} className={estilos.carril} style={{ height: alto }}>
            {numeros && <span className={cx(estilos.numero, activo && estilos.numeroActivo)}>{n}</span>}
            <div className={cx(estilos.linea, activo && estilos.lineaActiva)} />
          </div>
        );
      })}
    </div>
  );
}
