import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Icon } from '@/components/ds/Icon';
import type { BoteVista } from '@/datos';
import base from './base.module.css';
import estilos from './NombresBote.module.css';

/**
 * Nombres de un bote como una sola unidad: en K1 y C1 uno; en K2 y K4, los integrantes
 * uno debajo del otro. Cada uno abre su ficha.
 */
export function NombresBote({ bote, hrefDeportista }: { bote: BoteVista; hrefDeportista: (id: string) => string }) {
  return (
    <span className={estilos.nombres}>
      {bote.deportistas.map((d) => (
        <Link key={d.id} href={hrefDeportista(d.id)} scroll={false} className={base.enlaceNombre}>
          {d.nombreCompleto}
          <Icon icono={ChevronRight} size={16} />
        </Link>
      ))}
    </span>
  );
}
