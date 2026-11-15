import Link from 'next/link';
import { cx } from '@/components/ds/cx';
import { Logo } from '@/components/ds/Logo';
import estilos from './BloqueLogo.module.css';

export interface BloqueLogoProps {
  href: string;
  etiqueta: string;
  /** Cada cáscara cambia de tamaño en su propio punto de corte. */
  corte: 'publico' | 'panel';
}

/** Logo sobre azul con el doble corte en diagonal (franja celeste detrás). */
export function BloqueLogo({ href, etiqueta, corte }: BloqueLogoProps) {
  return (
    <div className={cx(estilos.marco, corte === 'publico' ? estilos.publico : estilos.panel)}>
      <Link href={href} aria-label={etiqueta} className={estilos.enlace}>
        <span className={estilos.recorte}>
          <Logo variante="horizontal" tamano={136} prioridad className={estilos.imagen} />
        </span>
      </Link>
    </div>
  );
}
