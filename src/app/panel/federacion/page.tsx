import { Plus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';

// Página provisoria: la reemplaza la spec 7.
export default function TableroPage() {
  return (
    <EncabezadoPanel
      titulo="Tablero"
      acciones={<AccionNoDisponible icon={Plus}>Crear competencia</AccionNoDisponible>}
    />
  );
}
