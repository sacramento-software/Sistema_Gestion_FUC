import { UserPlus } from 'lucide-react';
import { EncabezadoPanel } from '@/components/cascaras';
import { AccionNoDisponible } from '@/components/demo';

// Página provisoria: la reemplaza la spec 6.
export default function InicioDelegadoPage() {
  return (
    <EncabezadoPanel
      titulo="Inicio"
      acciones={
        <AccionNoDisponible variant="secundario" icon={UserPlus}>
          Agregar deportista
        </AccionNoDisponible>
      }
    />
  );
}
