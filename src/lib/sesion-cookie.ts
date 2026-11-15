// Solo servidor: usa node:crypto y el secreto de la sesión. No importar desde componentes de cliente.
// (El paquete `server-only` no está en las dependencias, por eso va este comentario.)
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Rol } from '@/lib/roles';

export const COOKIE_SESION = 'fuc-sesion';
export const DURACION_SESION_S = 43200;

const ROLES: readonly Rol[] = ['federacion', 'delegado', 'juez'];
const SECRETO_DESARROLLO = 'secreto-de-desarrollo-fuc-no-usar-en-produccion';

/** Falta `SESION_SECRETO` en producción: no se puede firmar ni verificar. */
export class SecretoFaltante extends Error {
  constructor() {
    super('Falta la variable de entorno SESION_SECRETO.');
    this.name = 'SecretoFaltante';
  }
}

let advertido = false;

// Se lee dentro de la función (nunca a nivel de módulo) para que el build no la necesite.
function obtenerSecreto(): string {
  const secreto = process.env.SESION_SECRETO;
  if (secreto) return secreto;
  if (process.env.NODE_ENV === 'production') throw new SecretoFaltante();
  if (!advertido) {
    advertido = true;
    console.warn('SESION_SECRETO no está definido: se usa un secreto fijo de desarrollo.');
  }
  return SECRETO_DESARROLLO;
}

function firmar(rol: string): string {
  return createHmac('sha256', obtenerSecreto()).update(rol).digest('base64url');
}

export function firmarRol(rol: Rol): string {
  return `${rol}.${firmar(rol)}`;
}

/** Devuelve el rol si el valor tiene formato y firma válidos; si no, `null`. Solo lanza `SecretoFaltante`. */
export function leerRolFirmado(valor: string | undefined | null): Rol | null {
  if (!valor) return null;
  const partes = valor.split('.');
  if (partes.length !== 2) return null;
  const [rol, firma] = partes;
  if (!ROLES.includes(rol as Rol)) return null;
  const esperada = Buffer.from(firmar(rol));
  const recibida = Buffer.from(firma);
  // Largo igualado: timingSafeEqual exige buffers del mismo tamaño.
  if (esperada.length !== recibida.length) return null;
  return timingSafeEqual(esperada, recibida) ? (rol as Rol) : null;
}
