import Image from 'next/image';
import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './Logo.module.css';

export interface LogoProps {
  variante?: 'sello' | 'horizontal' | 'firma';
  tamano?: number;
  /** Carga la imagen con prioridad (logo del encabezado, sobre el pliegue). */
  prioridad?: boolean;
  className?: string;
  style?: CSSProperties;
}

const NOMBRE = 'Federación Uruguaya de Canotaje';
const SELLO = '/imagenes/fuc-sello.jpg';
const HORIZONTAL = '/imagenes/fuc-logo-horizontal.jpg';

/** El sello nunca se recorta ni se redibuja; el logotipo horizontal tampoco. */
export function Logo({ variante = 'sello', tamano = 44, prioridad = false, className, style }: LogoProps) {
  if (variante === 'horizontal') {
    return (
      <span className={cx(estilos.logo, className)} style={style}>
        <Image src={HORIZONTAL} alt={NOMBRE} width={tamano} height={tamano} priority={prioridad} className={estilos.imagen} />
      </span>
    );
  }

  const sello = <Image src={SELLO} alt={NOMBRE} width={tamano} height={tamano} priority={prioridad} className={cx(estilos.imagen, estilos.circulo)} />;
  if (variante === 'sello') {
    return (
      <span className={cx(estilos.logo, className)} style={style}>
        {sello}
      </span>
    );
  }

  return (
    <span className={cx(estilos.logo, estilos.firma, className)} style={{ gap: Math.round(tamano / 4), ...style }}>
      {sello}
      <span className={estilos.separador} />
      <span className={estilos.textos}>
        <span className={estilos.sigla} style={{ fontSize: Math.round(tamano * 0.46) }}>
          FUC
        </span>
        <span className={estilos.nombre} style={{ fontSize: Math.max(11, Math.round(tamano * 0.26)) }}>
          {NOMBRE}
        </span>
      </span>
    </span>
  );
}
