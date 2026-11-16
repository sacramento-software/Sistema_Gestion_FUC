import type { ReactNode } from 'react';
import { Filete } from '@/components/ds';
import { AccionNoDisponible } from '@/components/demo';
import estilos from './federacion-resto.module.css';

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className={estilos.etiqueta}>{children}</span>;
}

interface TarjetaProps {
  titulo: string;
  meta?: ReactNode;
  /** Nivel del título (2 por defecto; 3 dentro de una sección con h2). */
  nivel?: 2 | 3;
  children: ReactNode;
}

/** Tarjeta con borde, radio de tarjeta y filete doble. */
export function Tarjeta({ titulo, meta, nivel = 2, children }: TarjetaProps) {
  const Titulo = nivel === 2 ? 'h2' : 'h3';
  return (
    <section aria-label={titulo} className={estilos.tarjeta}>
      <Filete />
      <div className={estilos.tarjetaCabecera}>
        <Titulo className={estilos.tarjetaTitulo}>{titulo}</Titulo>
        {meta && <Etiqueta>{meta}</Etiqueta>}
      </div>
      {children}
    </section>
  );
}

export function Metrica({ etiqueta, valor, detalle }: { etiqueta: string; valor: string | number; detalle?: string }) {
  return (
    <div className={estilos.metrica}>
      <Etiqueta>{etiqueta}</Etiqueta>
      <span className={estilos.metricaValor}>{valor}</span>
      {detalle && <span className={estilos.metricaDetalle}>{detalle}</span>}
    </div>
  );
}

export function Chip({ tono, children }: { tono?: 'exito' | 'peligro' | 'info'; children: ReactNode }) {
  const clase = [
    estilos.chip,
    tono === 'exito' && estilos.chipExito,
    tono === 'peligro' && estilos.chipPeligro,
    tono === 'info' && estilos.chipInfo,
  ]
    .filter(Boolean)
    .join(' ');
  return <span className={clase}>{children}</span>;
}

export interface DatoBarra {
  etiqueta: string;
  valor: number;
  /** Texto del valor; por defecto, el número. */
  texto?: string;
}

/**
 * Gráfico de barras horizontales hecho con CSS. El valor queda visible en cada barra, así que el gráfico
 * se lee como una lista etiqueta-valor sin depender del color ni del ancho.
 */
export function GraficoBarras({
  titulo,
  datos,
  nota,
  verDetalles = false,
}: {
  titulo: string;
  datos: DatoBarra[];
  nota?: string;
  verDetalles?: boolean;
}) {
  const maximo = Math.max(1, ...datos.map((d) => d.valor));
  return (
    <Tarjeta titulo={titulo} nivel={3}>
      <div className={estilos.tarjetaCuerpo}>
        <ul className={estilos.barras}>
          {datos.map((d) => (
            <li key={d.etiqueta} className={estilos.barra}>
              <span className={estilos.barraEtiqueta}>{d.etiqueta}</span>
              <span aria-hidden="true" className={estilos.riel}>
                <span className={estilos.relleno} style={{ width: `${Math.round((d.valor / maximo) * 100)}%` }} />
              </span>
              <span className={estilos.barraValor}>{d.texto ?? d.valor}</span>
            </li>
          ))}
        </ul>
      </div>
      {nota && <p className={estilos.nota}>{nota}</p>}
      {verDetalles && (
        <div className={estilos.pieTarjeta}>
          <AccionNoDisponible size="sm">Ver detalles</AccionNoDisponible>
        </div>
      )}
    </Tarjeta>
  );
}
