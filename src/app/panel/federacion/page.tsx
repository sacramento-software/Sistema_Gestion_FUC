import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';
import { mayuscula, Tablero } from '@/components/vistas/federacion-gestion';
import { formatearFecha, hoyISO } from '@/dominio';

export default function TableroPage() {
  return (
    <>
      <EncabezadoPanel
        titulo="Tablero"
        subtitulo={mayuscula(formatearFecha(hoyISO(), 'larga'))}
        acciones={<AccionNoDisponible icon={Plus}>Crear competencia</AccionNoDisponible>}
      />
      <Tablero />
    </>
  );
}
