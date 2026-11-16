import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Contenedor } from '@/components/cascaras';
import { Icon } from '@/components/ds/Icon';
import base from '@/components/vistas/regata/base.module.css';
import { BotonCompartir } from '@/components/vistas/regata/BotonCompartir';
import { FichaContenido } from '@/components/vistas/regata/FichaContenido';
import { fichaDeportista } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './page.module.css';

interface Props {
  params: Promise<{ deportistaId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { deportistaId } = await params;
  const ficha = fichaDeportista(deportistaId);
  return { title: ficha?.deportista.nombreCompleto ?? 'Deportista' };
}

export default async function DeportistaPage({ params }: Props) {
  const { deportistaId } = await params;
  const ficha = fichaDeportista(deportistaId);
  if (!ficha) notFound();

  return (
    <Contenedor className={estilos.pagina}>
      <div className={estilos.barra}>
        <Link href={rutas.deportistas()} className={base.atras}>
          <Icon icono={ChevronLeft} size={18} />
          Deportistas
        </Link>
        <BotonCompartir titulo={`${ficha.deportista.nombreCompleto} · FUC`} />
      </div>
      <FichaContenido ficha={ficha} hrefDeportista={rutas.deportista} variante="pagina" Titulo="h1" />
    </Contenedor>
  );
}
