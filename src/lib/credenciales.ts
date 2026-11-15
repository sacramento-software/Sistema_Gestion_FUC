import { USUARIOS_DEMO, type UsuarioDemo } from '@/lib/roles';

export const CONTRASENA_DEMO = 'demo';

/** Usuario sin distinguir mayúsculas ni espacios en los bordes; contraseña exacta. */
export function buscarCuenta(usuario: string, contrasena: string): UsuarioDemo | null {
  if (contrasena !== CONTRASENA_DEMO) return null;
  const buscado = usuario.trim().toLowerCase();
  return Object.values(USUARIOS_DEMO).find((u) => u.usuario === buscado) ?? null;
}
