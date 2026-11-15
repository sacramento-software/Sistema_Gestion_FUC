import { redirect } from 'next/navigation';
import { rutas } from '@/lib/rutas';
import { obtenerSesion } from '@/lib/sesion';

export default async function PanelPage() {
  const usuario = await obtenerSesion();
  redirect(usuario ? usuario.inicio : rutas.ingresar());
}
