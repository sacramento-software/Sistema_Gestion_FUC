'use client';

import { useRouter } from 'next/navigation';
import { Select } from '@/components/ds';

interface Props {
  eventos: { value: string; label: string }[];
  valor: string;
  /** URL base del armado; el evento elegido se agrega como `?evento=`. */
  base: string;
}

/** Cambiar de evento es navegar: no guarda nada. */
export function SelectorEvento({ eventos, valor, base }: Props) {
  const router = useRouter();
  return (
    <Select
      label="Evento"
      options={eventos}
      value={valor}
      onChange={(e) => router.push(`${base}?evento=${encodeURIComponent(e.target.value)}`)}
    />
  );
}
