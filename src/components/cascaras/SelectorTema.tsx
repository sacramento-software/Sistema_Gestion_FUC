'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/ds/ThemeToggle';
import { COOKIE_TEMA, type Tema } from '@/lib/tema-cookie';

const UN_ANIO = 60 * 60 * 24 * 365;

/** Cambia el modo en el `<html>` y lo guarda en la cookie `fuc-tema` (sin localStorage). */
export function SelectorTema({ temaInicial }: { temaInicial: Tema }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  const alternar = () => {
    const nuevo: Tema = tema === 'claro' ? 'noche' : 'claro';
    setTema(nuevo);
    document.documentElement.dataset.theme = nuevo;
    // La cáscara repite el tema en su contenedor (así el pie y la barra lateral conservan el azul de marca en modo claro).
    document.querySelectorAll<HTMLElement>('[data-envolvente-tema]').forEach((el) => {
      el.dataset.theme = nuevo;
    });
    document.cookie = `${COOKIE_TEMA}=${nuevo}; path=/; max-age=${UN_ANIO}; SameSite=Lax`;
  };

  return <ThemeToggle tema={tema} onToggle={alternar} />;
}
