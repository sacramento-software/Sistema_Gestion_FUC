import type { ReactNode } from 'react';
import { CascaraPanel } from '@/components/cascaras';
import { requerirRol } from '@/lib/sesion';

export default async function PanelJuezLayout({ children }: { children: ReactNode }) {
  const usuario = await requerirRol('juez');
  return <CascaraPanel usuario={usuario}>{children}</CascaraPanel>;
}
