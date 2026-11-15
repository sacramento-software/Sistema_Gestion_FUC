import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import { Logo } from '@/components/ds/Logo';
import { rutas } from '@/lib/rutas';
import estilos from './PiePublico.module.css';

const ENLACES = [
  { texto: 'Calendario', href: rutas.competencias() },
  { texto: 'Rankings', href: rutas.rankings() },
  { texto: 'Noticias', href: rutas.noticias() },
  { texto: 'Deportistas', href: rutas.deportistas() },
];

/** Pie de todas las páginas públicas: banda noche con franja celeste. */
export function PiePublico() {
  return (
    <footer data-theme="noche" className={estilos.pie}>
      <div className={estilos.franja} />
      <div className={estilos.interior}>
        <div className={estilos.columnas}>
          <div className={estilos.marca}>
            <div className={estilos.sello}>
              <Logo variante="sello" tamano={72} />
              <span className={estilos.federacion}>
                Federación Uruguaya
                <br />
                de Canotaje
              </span>
            </div>
            <span className={estilos.direccion}>
              <Icon icono={MapPin} size={18} />
              Lago Calcagno, 15000 Ciudad de la Costa, Canelones
            </span>
          </div>
          <nav aria-label="Pie" className={estilos.columna}>
            <span className={estilos.tituloColumna}>Competencias</span>
            {ENLACES.map((e) => (
              <Link key={e.href} href={e.href} className={estilos.enlace}>
                {e.texto}
              </Link>
            ))}
          </nav>
        </div>
        <div className={estilos.base}>
          <span>© 2026 Federación Uruguaya de Canotaje</span>
        </div>
      </div>
    </footer>
  );
}
