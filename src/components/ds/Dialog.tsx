'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from './cx';
import { Filete } from './Filete';
import { IconButton } from './IconButton';
import estilos from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  titulo: string;
  children?: ReactNode;
  acciones?: ReactNode;
  onClose?: () => void;
  ancho?: number;
  className?: string;
  style?: CSSProperties;
}

const FOCALIZABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, titulo, children, acciones, onClose, ancho = 480, className, style }: DialogProps) {
  const cajaRef = useRef<HTMLDivElement>(null);
  const tituloId = useId();

  useEffect(() => {
    if (!open) return;
    const previo = document.activeElement as HTMLElement | null;
    const caja = cajaRef.current;
    const lista = () => (caja ? Array.from(caja.querySelectorAll<HTMLElement>(FOCALIZABLES)) : []);
    (lista()[0] ?? caja)?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const elementos = lista();
      if (elementos.length === 0) {
        e.preventDefault();
        return;
      }
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      const activo = document.activeElement;
      if (e.shiftKey && (activo === primero || !caja?.contains(activo))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (activo === ultimo || !caja?.contains(activo))) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      previo?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={estilos.velo} onClick={onClose}>
      <div
        ref={cajaRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className={cx(estilos.caja, className)}
        style={{ maxWidth: ancho, ...style }}
        onClick={(e) => e.stopPropagation()}
      >
        <Filete />
        <div className={estilos.cabecera}>
          <h2 id={tituloId} className={estilos.titulo}>
            {titulo}
          </h2>
          {onClose && <IconButton icon={X} label="Cerrar" onClick={onClose} />}
        </div>
        <div className={estilos.cuerpo}>{children}</div>
        {acciones && <div className={estilos.acciones}>{acciones}</div>}
      </div>
    </div>
  );
}
