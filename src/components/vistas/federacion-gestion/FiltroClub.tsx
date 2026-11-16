'use client';

import { useRouter } from 'next/navigation';
import { Select } from '@/components/ds';
import estilos from './federacion.module.css';

interface Props {
  /** Ruta de la página sin parámetros. */
  base: string;
  pestana: string;
  actual: string;
  clubes: { id: string; nombre: string }[];
}

/** Filtro por club: el `Select` del DS no lleva `name`, así que al elegir se navega con `?club=` en la URL. */
export function FiltroClub({ base, pestana, actual, clubes }: Props) {
  const router = useRouter();
  return (
    <div className={estilos.formularioFiltro}>
      <Select
        label="Club"
        value={actual}
        options={[{ value: '', label: 'Todos los clubes' }, ...clubes.map((c) => ({ value: c.id, label: c.nombre }))]}
        onChange={(e) => {
          const consulta = new URLSearchParams({ pestana });
          if (e.target.value) consulta.set('club', e.target.value);
          router.push(`${base}?${consulta.toString()}`);
        }}
      />
    </div>
  );
}
