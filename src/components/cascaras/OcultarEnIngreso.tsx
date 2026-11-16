'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { rutas } from '@/lib/rutas';

/** No muestra su contenido en la pantalla de ingreso (por ejemplo, el pie). */
export function OcultarEnIngreso({ children }: { children: ReactNode }) {
  return usePathname() === rutas.ingresar() ? null : <>{children}</>;
}
