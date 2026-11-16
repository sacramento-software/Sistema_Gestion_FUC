'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@/components/ds/cx';
import { TEXTO_NO_DISPONIBLE } from '@/lib/demo';
import estilos from './AccionNoDisponible.module.css';

export interface AccionNoDisponibleClienteProps {
  variant: 'primario' | 'secundario' | 'terciario' | 'peligro' | 'icono';
  size: 'md' | 'sm';
  fullWidth: boolean;
  /** Nombre accesible; solo en la variante `icono`. */
  label?: string;
  /** Contenido ya armado en el servidor (íconos y rótulo). */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const MARGEN = 8;
const SEPARACION = 8;
const MS_TACTIL = 3000;

/**
 * Parte interactiva de `AccionNoDisponible`. Recibe el contenido como nodos de React
 * (no como componentes de ícono) para que la acción se pueda usar desde Server Components.
 */
export function AccionNoDisponibleCliente({
  variant,
  size,
  fullWidth,
  label,
  children,
  className,
  style,
}: AccionNoDisponibleClienteProps) {
  const [visible, setVisible] = useState(false);
  const [posicion, setPosicion] = useState<{ top: number; left: number } | null>(null);
  const id = useId();
  const raizRef = useRef<HTMLSpanElement>(null);
  const globoRef = useRef<HTMLSpanElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ultimoPuntero = useRef<string>('mouse');

  const limpiarTemporizador = useCallback(() => {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }
  }, []);

  const ocultar = useCallback(() => {
    limpiarTemporizador();
    setVisible(false);
  }, [limpiarTemporizador]);

  // El globo va en un portal con posición fija: así ninguna tabla ni tarjeta con `overflow: hidden` lo recorta.
  // Arriba si entra, abajo si no, y sin salirse del ancho de pantalla.
  useLayoutEffect(() => {
    if (!visible) return;
    const raiz = raizRef.current;
    const globo = globoRef.current;
    if (!raiz || !globo) return;
    const caja = raiz.getBoundingClientRect();
    const abajo = caja.top - globo.offsetHeight - SEPARACION < MARGEN;
    const top = abajo ? caja.bottom + SEPARACION : caja.top - globo.offsetHeight - SEPARACION;
    const limite = document.documentElement.clientWidth - MARGEN;
    const centrado = caja.left + caja.width / 2 - globo.offsetWidth / 2;
    const left = Math.max(MARGEN, Math.min(centrado, limite - globo.offsetWidth));
    setPosicion({ top, left });
  }, [visible]);

  // Al desplazarse la página el globo quedaría fuera de lugar: se oculta.
  useEffect(() => {
    if (!visible) return;
    const alDesplazar = () => ocultar();
    window.addEventListener('scroll', alDesplazar, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', alDesplazar, true);
  }, [visible, ocultar]);

  // Al tocar fuera (celular) se oculta.
  useEffect(() => {
    if (!visible) return;
    const alTocarFuera = (e: globalThis.PointerEvent) => {
      if (!raizRef.current?.contains(e.target as Node)) ocultar();
    };
    document.addEventListener('pointerdown', alTocarFuera);
    return () => document.removeEventListener('pointerdown', alTocarFuera);
  }, [visible, ocultar]);

  useEffect(() => limpiarTemporizador, [limpiarTemporizador]);

  const alPresionar = (e: PointerEvent<HTMLButtonElement>) => {
    ultimoPuntero.current = e.pointerType;
  };

  const alHacerClic = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
    if (ultimoPuntero.current === 'touch' || ultimoPuntero.current === 'pen') {
      limpiarTemporizador();
      temporizador.current = setTimeout(() => setVisible(false), MS_TACTIL);
    }
  };

  const soloIcono = variant === 'icono';

  return (
    <span
      ref={raizRef}
      className={cx(estilos.raiz, fullWidth && !soloIcono && estilos.raizCompleta, className)}
      style={style}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        if (ultimoPuntero.current !== 'touch') ocultar();
      }}
    >
      <button
        type="button"
        aria-disabled="true"
        aria-label={soloIcono ? label : undefined}
        aria-describedby={visible ? id : undefined}
        className={cx(
          estilos.boton,
          soloIcono ? estilos.icono : cx(estilos[variant], estilos[size]),
          fullWidth && !soloIcono && estilos.completo,
        )}
        onPointerDown={alPresionar}
        onClick={alHacerClic}
        onFocus={() => setVisible(true)}
        onBlur={ocultar}
        onKeyDown={(e) => {
          if (e.key === 'Escape') ocultar();
        }}
      >
        {children}
      </button>
      {visible &&
        createPortal(
          <span
            ref={globoRef}
            id={id}
            role="tooltip"
            className={estilos.globo}
            style={{ top: posicion?.top ?? 0, left: posicion?.left ?? 0, visibility: posicion ? 'visible' : 'hidden' }}
          >
            {TEXTO_NO_DISPONIBLE}
          </span>,
          document.body,
        )}
    </span>
  );
}
