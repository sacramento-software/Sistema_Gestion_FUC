import type { ReactNode } from 'react';
import { CascaraPublica } from '@/components/cascaras';
import { serieEnVivo } from '@/datos';
import { rutas } from '@/lib/rutas';
import { obtenerSesion } from '@/lib/sesion';

export default async function PublicoLayout({ children }: { children: ReactNode }) {
  const usuario = await obtenerSesion();
  const enVivo = serieEnVivo();
  return (
    <CascaraPublica usuario={usuario}
      hayEnVivo={enVivo !== null}
      rutaEnVivo={enVivo ? rutas.serie(enVivo.competenciaId, enVivo.id) : null}
    >
      {children}
    </CascaraPublica>
  );
}
