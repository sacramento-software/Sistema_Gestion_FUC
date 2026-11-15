import type { ReactNode } from 'react';
import { CascaraPublica } from '@/components/cascaras';
import { serieEnVivo } from '@/datos';
import { obtenerSesion } from '@/lib/sesion';

export default async function PublicoLayout({ children }: { children: ReactNode }) {
  const usuario = await obtenerSesion();
  return (
    <CascaraPublica usuario={usuario} hayEnVivo={serieEnVivo() !== null}>
      {children}
    </CascaraPublica>
  );
}
