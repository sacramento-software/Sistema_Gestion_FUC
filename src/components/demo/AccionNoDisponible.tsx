import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Icon } from '@/components/ds/Icon';
import { AccionNoDisponibleCliente } from './AccionNoDisponibleCliente';

interface BaseProps {
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface ConRotulo extends BaseProps {
  variant?: 'primario' | 'secundario' | 'terciario' | 'peligro';
  children: ReactNode;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  label?: string;
}

interface SoloIcono extends BaseProps {
  variant: 'icono';
  children?: undefined;
  icon: LucideIcon;
  iconRight?: undefined;
  /** Va en `aria-label`. */
  label: string;
}

export type AccionNoDisponibleProps = ConRotulo | SoloIcono;

/**
 * Acción que la demo no implementa. Se ve deshabilitada pero recibe foco
 * (`aria-disabled`, nunca `disabled`) y muestra un aviso con el mouse, el
 * teclado o el toque. No navega ni envía nada.
 *
 * Este envoltorio corre donde se lo use (servidor o cliente): arma los íconos como
 * nodos y se los pasa a la parte interactiva, porque un componente de ícono no se
 * puede enviar como prop desde un Server Component a un Client Component.
 */
export function AccionNoDisponible(props: AccionNoDisponibleProps) {
  const { size = 'md', fullWidth = false, className, style } = props;

  if (props.variant === 'icono') {
    return (
      <AccionNoDisponibleCliente variant="icono" size={size} fullWidth={fullWidth} label={props.label} className={className} style={style}>
        <Icon icono={props.icon} size={22} />
      </AccionNoDisponibleCliente>
    );
  }

  return (
    <AccionNoDisponibleCliente
      variant={props.variant ?? 'primario'}
      size={size}
      fullWidth={fullWidth}
      className={className}
      style={style}
    >
      {props.icon && <Icon icono={props.icon} size={18} />}
      {props.children}
      {props.iconRight && <Icon icono={props.iconRight} size={18} />}
    </AccionNoDisponibleCliente>
  );
}
