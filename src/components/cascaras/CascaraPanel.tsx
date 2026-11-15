import type { ReactNode } from 'react';
import type { UsuarioDemo } from '@/lib/roles';
import { leerTema } from '@/lib/tema';
import { PanelCliente } from './PanelCliente';

export interface CascaraPanelProps {
  usuario: UsuarioDemo;
  contexto?: string;
  children?: ReactNode;
}

export async function CascaraPanel({ usuario, contexto, children }: CascaraPanelProps) {
  const tema = await leerTema();
  return (
    <PanelCliente usuario={usuario} contexto={contexto} tema={tema}>
      {children}
    </PanelCliente>
  );
}
