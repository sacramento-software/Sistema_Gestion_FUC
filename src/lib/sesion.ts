import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { USUARIOS_DEMO, type Rol, type UsuarioDemo } from '@/lib/roles';
import { rutas } from '@/lib/rutas';
import { COOKIE_SESION, leerRolFirmado } from '@/lib/sesion-cookie';

export async function obtenerSesion(): Promise<UsuarioDemo | null> {
  const valor = (await cookies()).get(COOKIE_SESION)?.value;
  try {
    const rol = leerRolFirmado(valor);
    return rol ? USUARIOS_DEMO[rol] : null;
  } catch (error) {
    console.error('No se pudo verificar la sesión:', error);
    return null;
  }
}

export async function requerirRol(rol: Rol): Promise<UsuarioDemo> {
  const sesion = await obtenerSesion();
  if (!sesion) redirect(rutas.ingresar());
  if (sesion.rol !== rol) redirect(sesion.inicio);
  return sesion;
}
