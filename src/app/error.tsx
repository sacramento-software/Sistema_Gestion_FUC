'use client';

import { Button } from '@/components/ds';
import estilos from './mensaje.module.css';

export default function ErrorPagina({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={estilos.contenedor}>
      <p className={estilos.titulo}>No pudimos cargar esta página.</p>
      <p className={estilos.texto}>Volvé a intentar en unos segundos.</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
