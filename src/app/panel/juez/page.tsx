import { Pencil } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';

// Página provisoria: la reemplaza la spec 5.
export default function JornadaPage() {
  return (
    <EncabezadoPanel
      titulo="Jornada"
      acciones={<AccionNoDisponible variant="icono" icon={Pencil} label="Corregir tiempo" />}
    />
  );
}
