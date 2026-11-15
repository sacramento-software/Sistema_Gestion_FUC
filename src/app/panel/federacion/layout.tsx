import type { ReactNode } from 'react';
import { CascaraPanel } from '@/components/cascaras';
import { requerirRol } from '@/lib/sesion';

export default async function PanelFederacionLayout({ children }: { children: ReactNode }) {
  const usuario = await requerirRol('federacion');
  return <CascaraPanel usuario={usuario}>{children}</CascaraPanel>;
}
