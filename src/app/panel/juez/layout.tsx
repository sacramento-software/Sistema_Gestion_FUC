import type { ReactNode } from 'react';
import { CascaraPanel } from '@/components/cascaras';
import { competenciaEnCurso } from '@/datos';
import { requerirRol } from '@/lib/sesion';

export default async function PanelJuezLayout({ children }: { children: ReactNode }) {
  const usuario = await requerirRol('juez');
  const enCurso = competenciaEnCurso();
  const contexto = enCurso ? `${enCurso.nombre} · ${enCurso.fechas.corta}` : undefined;
  return (
    <CascaraPanel usuario={usuario} contexto={contexto}>
      {children}
    </CascaraPanel>
  );
}
