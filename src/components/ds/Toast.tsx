import { AlertCircle, Check, Info, X, type LucideIcon } from 'lucide-react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';
import estilos from './Toast.module.css';

type TipoToast = 'exito' | 'error' | 'info';

const ICONOS: Record<TipoToast, LucideIcon> = { exito: Check, error: AlertCircle, info: Info };

export interface ToastProps {
  tipo?: TipoToast;
  titulo?: string;
  children?: ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}

export function Toast({ tipo = 'exito', titulo, children, onClose, className, style }: ToastProps) {
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={cx(estilos.aviso, estilos[tipo], className)} style={style}>
      <span className={estilos.icono}>
        <Icon icono={ICONOS[tipo]} size={16} color="var(--toast-fondo)" />
      </span>
      <div className={estilos.texto}>
        {titulo && <strong>{titulo} </strong>}
        {children}
      </div>
      {onClose && (
        <button type="button" aria-label="Cerrar" onClick={onClose} className={estilos.cerrar}>
          <Icon icono={X} size={18} />
        </button>
      )}
    </div>
  );
}
