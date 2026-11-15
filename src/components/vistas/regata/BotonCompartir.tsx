'use client';

import { Check, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import estilos from './BotonCompartir.module.css';

export interface BotonCompartirProps {
  titulo: string;
  /** Ruta a compartir; si falta, la URL actual. */
  ruta?: string;
  variante?: 'boton' | 'icono';
  etiqueta?: string;
}

/** Usa el menú de compartir del sistema si existe; si no, copia el enlace y avisa. */
export function BotonCompartir({ titulo, ruta, variante = 'boton', etiqueta = 'Compartir' }: BotonCompartirProps) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  const compartir = async () => {
    const url = ruta ? new URL(ruta, window.location.origin).href : window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        // El usuario canceló el menú de compartir.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopiado(true);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setCopiado(false), 2400);
  };

  return (
    <span className={estilos.grupo}>
      <span role="status" className={estilos.estado}>
        {copiado && (
          <>
            <Icon icono={Check} size={16} />
            Enlace copiado
          </>
        )}
      </span>
      {variante === 'icono' ? (
        <IconButton icon={Share2} label={etiqueta} onClick={compartir} />
      ) : (
        <Button variant="secundario" icon={Share2} onClick={compartir}>
          {etiqueta}
        </Button>
      )}
    </span>
  );
}
