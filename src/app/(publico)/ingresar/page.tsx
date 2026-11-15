import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { obtenerSesion } from '@/lib/sesion';
import { FormularioIngreso } from './FormularioIngreso';

export const metadata: Metadata = { title: 'Ingresar' };

export default async function IngresarPage() {
  const usuario = await obtenerSesion();
  if (usuario) redirect(usuario.inicio);
  return <FormularioIngreso />;
}
