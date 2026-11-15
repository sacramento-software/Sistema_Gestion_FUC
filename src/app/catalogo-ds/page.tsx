import { notFound } from 'next/navigation';
import { leerTema } from '@/lib/tema';
import { Catalogo } from './Catalogo';

export const metadata = { title: 'Catálogo del DS' };

// Herramienta de verificación: solo existe en desarrollo y no se enlaza desde ninguna parte.
export default async function CatalogoPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  const tema = await leerTema();
  return <Catalogo temaInicial={tema} />;
}
