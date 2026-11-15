// Stub de la spec 1. La spec 2 reemplaza la implementación sin cambiar las firmas.
import { USUARIOS_DEMO, type Rol, type UsuarioDemo } from '@/lib/roles';

export async function obtenerSesion(): Promise<UsuarioDemo | null> {
  return null;
}

export async function requerirRol(rol: Rol): Promise<UsuarioDemo> {
  return USUARIOS_DEMO[rol];
}
