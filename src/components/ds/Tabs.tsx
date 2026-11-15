'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cx } from './cx';
import estilos from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  href?: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function Tabs({ items = [], value, onChange, className, style }: TabsProps) {
  const conEnlaces = items.some((it) => it.href);
  return (
    <div role={conEnlaces ? undefined : 'tablist'} className={cx(estilos.pestanas, className)} style={style}>
      {items.map((it) => {
        const activa = it.id === value;
        const contenido = (
          <>
            {it.label}
            {it.count != null && <span className={estilos.cuenta}>{it.count}</span>}
          </>
        );
        if (it.href) {
          return (
            <Link
              key={it.id}
              href={it.href}
              aria-current={activa ? 'page' : undefined}
              className={cx(estilos.pestana, activa && estilos.activa)}
            >
              {contenido}
            </Link>
          );
        }
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={activa}
            onClick={() => onChange?.(it.id)}
            className={cx(estilos.pestana, activa && estilos.activa)}
          >
            {contenido}
          </button>
        );
      })}
    </div>
  );
}
