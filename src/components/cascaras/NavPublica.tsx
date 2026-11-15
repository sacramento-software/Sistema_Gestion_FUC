'use client';

import { Calendar, LayoutDashboard, LogIn, Newspaper, Radio, Trophy, Users, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/components/ds/cx';
import { Icon } from '@/components/ds/Icon';
import { PuntoEnVivo } from '@/components/ds/PuntoEnVivo';
import { rutas } from '@/lib/rutas';
import estilos from './NavPublica.module.css';

interface Destino {
  texto: string;
  icono: LucideIcon;
  href: string;
  enVivo?: boolean;
}

const DESTINOS: Destino[] = [
  { texto: 'Competencias', icono: Calendar, href: rutas.competencias() },
  { texto: 'En vivo', icono: Radio, href: rutas.enVivo(), enVivo: true },
  { texto: 'Rankings', icono: Trophy, href: rutas.rankings() },
  { texto: 'Noticias', icono: Newspaper, href: rutas.noticias() },
  { texto: 'Deportistas', icono: Users, href: rutas.deportistas() },
];

const esActivo = (ruta: string, href: string) => ruta === href || ruta.startsWith(`${href}/`);

/** Navegación del encabezado (escritorio). */
export function NavEscritorio({ hayEnVivo }: { hayEnVivo: boolean }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Principal" className={estilos.escritorio}>
      {DESTINOS.map((d) => {
        const activo = esActivo(ruta, d.href);
        return (
          <Link
            key={d.href}
            href={d.href}
            aria-current={activo ? 'page' : undefined}
            className={cx(estilos.enlace, activo && estilos.activo)}
          >
            {d.enVivo && hayEnVivo && <PuntoEnVivo />}
            {d.texto}
          </Link>
        );
      })}
    </nav>
  );
}

/** Navegación inferior fija (celular y tableta). */
export function NavInferior({ hayEnVivo }: { hayEnVivo: boolean }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Secciones" className={estilos.inferior}>
      {DESTINOS.map((d) => {
        const activo = esActivo(ruta, d.href);
        return (
          <Link
            key={d.href}
            href={d.href}
            aria-current={activo ? 'page' : undefined}
            className={cx(estilos.item, activo && estilos.itemActivo)}
          >
            <span className={estilos.icono}>
              <Icon icono={d.icono} size={22} />
              {d.enVivo && hayEnVivo && <PuntoEnVivo className={estilos.punto} />}
            </span>
            {d.texto}
          </Link>
        );
      })}
    </nav>
  );
}

/** «Ingresar» o «Ir al panel»; en `/ingresar` no se muestra ninguno. */
export function BotonSesion({ inicioPanel }: { inicioPanel: string | null }) {
  const ruta = usePathname();
  if (ruta === rutas.ingresar() || ruta.startsWith(`${rutas.ingresar()}/`)) return null;
  const hayUsuario = inicioPanel !== null;
  return (
    <Link href={hayUsuario ? inicioPanel : rutas.ingresar()} className={estilos.sesion}>
      <Icon icono={hayUsuario ? LayoutDashboard : LogIn} size={18} className={estilos.iconoSesion} />
      {hayUsuario ? 'Ir al panel' : 'Ingresar'}
    </Link>
  );
}
