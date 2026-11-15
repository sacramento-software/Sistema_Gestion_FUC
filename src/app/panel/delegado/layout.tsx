import type { ReactNode } from 'react';
import { CascaraPanel } from '@/components/cascaras';
import { requerirRol } from '@/lib/sesion';

export default async function PanelDelegadoLayout({ children }: { children: ReactNode }) {
  const usuario = await requerirRol('delegado');
  return <CascaraPanel usuario={usuario}>{children}</CascaraPanel>;
}
