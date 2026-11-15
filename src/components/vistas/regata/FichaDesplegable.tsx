'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Filete } from '@/components/ds/Filete';
import { IconButton } from '@/components/ds/IconButton';
import { BotonCompartir } from './BotonCompartir';
import estilos from './FichaDesplegable.module.css';

export interface FichaDesplegableProps {
  nombre: string;
  /** URL de la página sin `?deportista`. */
  cerrarHref: string;
  /** Ruta de la ficha como página propia, la que se comparte. */
  rutaCompartir: string;
  children: ReactNode;
}

const FOCALIZABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Hoja inferior (celular) o panel lateral (escritorio) con la ficha. Atrapa el foco y se cierra con Escape. */
export function FichaDesplegable({ nombre, cerrarHref, rutaCompartir, children }: FichaDesplegableProps) {
  const router = useRouter();
  const panel = useRef<HTMLElement>(null);

  const cerrar = useCallback(() => {
    router.push(cerrarHref, { scroll: false });
  }, [router, cerrarHref]);

  useEffect(() => {
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();

    const alTeclear = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflow;
      if (anterior && document.contains(anterior)) anterior.focus({ preventScroll: true });
    };
  }, [cerrar]);

  // Mantiene el foco dentro de la ficha mientras está abierta.
  const atraparFoco = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' || !panel.current) return;
    const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCALIZABLES));
    if (items.length === 0) return;
    const primero = items[0];
    const ultimo = items[items.length - 1];
    const activo = document.activeElement;
    if (e.shiftKey && (activo === primero || activo === panel.current)) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && activo === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  };

  return (
    <>
      <div aria-hidden="true" className={estilos.velo} onClick={cerrar} />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha de ${nombre}`}
        tabIndex={-1}
        className={estilos.panel}
        onKeyDown={atraparFoco}
      >
        <div className={estilos.cabecera}>
          <Filete />
          <div aria-hidden="true" className={estilos.tirador}>
            <span />
          </div>
          <div className={estilos.acciones}>
            <BotonCompartir variante="icono" etiqueta="Compartir ficha" titulo={`${nombre} · FUC`} ruta={rutaCompartir} />
            <IconButton icon={X} label="Cerrar ficha" onClick={cerrar} />
          </div>
        </div>
        <div className={estilos.cuerpo}>{children}</div>
      </aside>
    </>
  );
}
