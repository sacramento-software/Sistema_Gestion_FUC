'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buscarCuenta } from '@/lib/credenciales';
import { COOKIE_SESION, DURACION_SESION_S, firmarRol } from '@/lib/sesion-cookie';

export interface EstadoIngreso {
  error: 'credenciales' | 'servidor' | null;
}

export async function ingresar(_estadoPrevio: EstadoIngreso, formData: FormData): Promise<EstadoIngreso> {
  const usuarioIngresado = String(formData.get('usuario') ?? '');
  const contrasena = String(formData.get('contrasena') ?? '');
  const cuenta = buscarCuenta(usuarioIngresado, contrasena);
  if (!cuenta) return { error: 'credenciales' };

  try {
    const valor = firmarRol(cuenta.rol);
    (await cookies()).set(COOKIE_SESION, valor, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: DURACION_SESION_S,
    });
  } catch (error) {
    console.error('No se pudo iniciar la sesión:', error);
    return { error: 'servidor' };
  }
  redirect(cuenta.inicio);
}
