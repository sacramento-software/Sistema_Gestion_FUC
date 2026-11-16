import Link from 'next/link';
import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Filete, Icon, PuntoEnVivo } from '@/components/ds';
import type { SerieDetalle } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './federacion.module.css';

/** Valor de un parámetro de URL: si viene repetido, el primero. */
export function primero(valor: string | string[] | undefined): string | undefined {
  const elegido = Array.isArray(valor) ? valor[0] : valor;
  return elegido && elegido.trim() ? elegido.trim() : undefined;
}

/** Arma `base?a=1&b=2` omitiendo los parámetros vacíos. */
export function armarUrl(base: string, params: Record<string, string | undefined>): string {
  const consulta = new URLSearchParams();
  for (const [clave, valor] of Object.entries(params)) {
    if (valor) consulta.set(clave, valor);
  }
  const texto = consulta.toString();
  return texto ? `${base}?${texto}` : base;
}

export function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className={estilos.etiqueta}>{children}</span>;
}

interface TarjetaProps {
  etiquetaAria: string;
  titulo: string;
  meta?: ReactNode;
  children: ReactNode;
}

/** Tarjeta con filete doble, título y un rótulo en mono a la derecha. */
export function Tarjeta({ etiquetaAria, titulo, meta, children }: TarjetaProps) {
  return (
    <section aria-label={etiquetaAria} className={estilos.tarjeta}>
      <Filete />
      <div className={estilos.tarjetaCabecera}>
        <h2 className={estilos.tarjetaTitulo}>{titulo}</h2>
        {meta && <Etiqueta>{meta}</Etiqueta>}
      </div>
      {children}
    </section>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className={estilos.vacio}>{children}</p>;
}

export function BandaInfo({ children }: { children: ReactNode }) {
  return (
    <div className={`${estilos.banda} ${estilos.bandaInfo}`}>
      <Icon icono={Info} size={20} />
      <span className={estilos.bandaTexto}>{children}</span>
    </div>
  );
}

/** Banda en vivo: serie en curso, con enlace a la página pública de la serie. */
export function BandaEnVivo({ serie, competenciaNombre, enlaces }: { serie: SerieDetalle; competenciaNombre?: string; enlaces?: ReactNode }) {
  return (
    <div className={`${estilos.banda} ${estilos.bandaVivo}`} role="status">
      <span className={estilos.bandaRotulo}>
        <PuntoEnVivo tamano={10} />
        En vivo
      </span>
      <span className={estilos.bandaTexto}>
        <strong>
          {serie.titulo} · {serie.categoriaGenero}
        </strong>
        {serie.largada ? ` · largó a las ${serie.largada} h` : ''}
        {competenciaNombre ? <span className={estilos.subtexto}> · {competenciaNombre}</span> : null}
      </span>
      <span className={estilos.bandaEnlaces}>
        {enlaces ?? (
          <Link href={rutas.serie(serie.competenciaId, serie.id)} className={estilos.enlace}>
            Ver en el sitio público
          </Link>
        )}
      </span>
    </div>
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
