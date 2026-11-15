import { cookies } from 'next/headers';
import { COOKIE_TEMA, type Tema } from './tema-cookie';

export { COOKIE_TEMA, type Tema };

/** Lee el tema de la cookie `fuc-tema`. Sin cookie o con otro valor, devuelve 'claro'. */
export async function leerTema(): Promise<Tema> {
  const almacen = await cookies();
  return almacen.get(COOKIE_TEMA)?.value === 'noche' ? 'noche' : 'claro';
}
