import { NextResponse } from 'next/server';
import { rutas } from '@/lib/rutas';
import { COOKIE_SESION } from '@/lib/sesion-cookie';

// Solo POST: un GET a /salir da 405.
export async function POST(request: Request) {
  const respuesta = NextResponse.redirect(new URL(rutas.ingresar(), request.url), 303);
  respuesta.cookies.delete({ name: COOKIE_SESION, path: '/' });
  return respuesta;
}
