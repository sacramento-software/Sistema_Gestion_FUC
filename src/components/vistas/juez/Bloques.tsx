import type { ReactNode } from 'react';
import { Filete } from '@/components/ds';
import { competenciaEnCurso } from '@/datos';
import estilos from './juez.module.css';

/** «Campeonato Nacional de Velocidad · Lago Calcagno · 15 y 16 nov 2026», o nada si no hay competencia en curso. */
export function subtituloJuez(): string | undefined {
  const c = competenciaEnCurso();
  return c ? `${c.nombre} · ${c.sede} · ${c.fechas.media}` : undefined;
}

/** «1», «1 y 2», «1, 2 y 8». */
export function listaDeNumeros(ns: number[]): string {
  if (ns.length < 2) return String(ns[0] ?? '');
  return `${ns.slice(0, -1).join(', ')} y ${ns[ns.length - 1]}`;
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className={estilos.etiqueta}>{children}</span>;
}

interface TarjetaProps {
  etiquetaAria: string;
  titulo: string;
  meta?: ReactNode;
  children: ReactNode;
  /** «revision»: fondo crema amarillo; «publicada»: fondo azul sólido. */
  variante?: 'revision' | 'publicada';
}

/** Tarjeta con filete doble, título y un texto en mono a la derecha. */
export function TarjetaJuez({ etiquetaAria, titulo, meta, children, variante }: TarjetaProps) {
  const extra = variante === 'revision' ? estilos.tarjetaRevision : variante === 'publicada' ? estilos.tarjetaPublicada : '';
  return (
    <section aria-label={etiquetaAria} className={`${estilos.tarjeta} ${extra}`}>
      <Filete />
      <div className={estilos.tarjetaCabecera}>
        <h4 className={estilos.tarjetaTitulo}>{titulo}</h4>
        {meta && <Etiqueta>{meta}</Etiqueta>}
      </div>
      {children}
    </section>
  );
}

export function Barra({ valor, total }: { valor: number; total: number }) {
  const ancho = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <span aria-hidden="true" className={estilos.barra}>
      <span className={estilos.barraRelleno} style={{ width: `${ancho}%` }} />
    </span>
  );
}

export function NumeroCarril({ n }: { n: number }) {
  return <span className={estilos.numeroCarril}>{n}</span>;
}
