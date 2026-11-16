'use client';

import { ChevronDown, ChevronUp, ExternalLink, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '@/components/ds/cx';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import { SECCIONES_PANEL, type UsuarioDemo } from '@/lib/roles';
import { rutas } from '@/lib/rutas';
import type { Tema } from '@/lib/tema-cookie';
import { BloqueLogo } from './BloqueLogo';
import { SelectorTema } from './SelectorTema';
import estilos from './PanelCliente.module.css';

export interface PanelClienteProps {
  usuario: UsuarioDemo;
  contexto?: string;
  tema: Tema;
  children?: ReactNode;
}

/** Sección activa: la de `href` más largo que sea prefijo de la ruta actual. */
function seccionActiva(ruta: string, hrefs: string[]): string | null {
  let mejor: string | null = null;
  for (const href of hrefs) {
    const coincide = ruta === href || ruta.startsWith(`${href}/`);
    if (coincide && (mejor === null || href.length > mejor.length)) mejor = href;
  }
  return mejor;
}

export function PanelCliente({ usuario, contexto, tema, children }: PanelClienteProps) {
  const ruta = usePathname();
  const secciones = SECCIONES_PANEL[usuario.rol];
  const activa = seccionActiva(ruta, secciones.map((s) => s.href));

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioAbierto, setUsuarioAbierto] = useState(false);
  const botonMenuRef = useRef<HTMLSpanElement>(null);
  const cerrarMenuRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Panel deslizable (celular y tableta): Escape lo cierra y el foco vuelve al botón que lo abrió.
  useEffect(() => {
    if (!menuAbierto) return;
    cerrarMenuRef.current?.querySelector('button')?.focus();
    const boton = botonMenuRef.current?.querySelector('button');
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      boton?.focus();
    };
  }, [menuAbierto]);

  // Menú del chip: Escape y clic fuera lo cierran.
  useEffect(() => {
    if (!usuarioAbierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUsuarioAbierto(false);
        chipRef.current?.querySelector('button')?.focus();
      }
    };
    const alTocar = (e: PointerEvent) => {
      if (!chipRef.current?.contains(e.target as Node)) setUsuarioAbierto(false);
    };
    document.addEventListener('keydown', alTeclear);
    document.addEventListener('pointerdown', alTocar);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.removeEventListener('pointerdown', alTocar);
    };
  }, [usuarioAbierto]);

  return (
    <div className={estilos.raiz} data-theme={tema} data-envolvente-tema>
      <header className={estilos.barra}>
        <div className={estilos.franja} />
        <div className={estilos.fila}>
          <BloqueLogo href={usuario.inicio} etiqueta="Federación Uruguaya de Canotaje, panel" corte="panel" />
          <span ref={botonMenuRef} className={estilos.abrirMenu}>
            <IconButton icon={Menu} label="Abrir menú" onClick={() => setMenuAbierto(true)} />
          </span>
          <div className={estilos.titulo}>
            <span className={estilos.tituloSec}>Panel</span>
            <span aria-hidden="true" className={estilos.tituloSec}>
              ·
            </span>
            <span className={estilos.tituloRol}>{usuario.etiquetaPanel}</span>
          </div>
          <div className={estilos.derecha}>
            <SelectorTema temaInicial={tema} />
            <div ref={chipRef} className={estilos.chipEnvoltorio}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={usuarioAbierto}
                aria-controls={usuarioAbierto ? menuId : undefined}
                aria-label={`Menú de usuario: ${usuario.nombre}`}
                className={estilos.chip}
                onClick={() => setUsuarioAbierto((v) => !v)}
              >
                <span aria-hidden="true" className={estilos.avatar}>
                  {usuario.iniciales}
                </span>
                <span className={estilos.chipTextos}>
                  <span className={estilos.chipNombre}>{usuario.nombre}</span>
                  <span className={estilos.chipRol}>{usuario.rolTexto}</span>
                </span>
                <Icon icono={usuarioAbierto ? ChevronUp : ChevronDown} size={16} className={estilos.chipFlecha} />
              </button>
              {usuarioAbierto && (
                <div id={menuId} role="menu" aria-label="Usuario" className={estilos.menuUsuario}>
                  <div className={estilos.menuFilete} />
                  <form method="post" action={rutas.salir()}>
                    <button type="submit" role="menuitem" className={estilos.menuItem} autoFocus>
                      <Icon icono={LogOut} size={20} />
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={estilos.cuerpo}>
        {menuAbierto && <div className={estilos.velo} onClick={() => setMenuAbierto(false)} aria-hidden="true" />}
        <aside aria-label="Secciones del panel" data-theme="noche" className={cx(estilos.lateral, menuAbierto && estilos.lateralAbierto)}>
          <div className={estilos.lateralCabecera}>
            <div className={estilos.lateralTextos}>
              <span className={estilos.lateralEtiqueta}>Panel</span>
              <span className={estilos.lateralRol}>{usuario.etiquetaPanel}</span>
              <span className={estilos.lateralContexto}>{contexto ?? usuario.contextoPanel}</span>
            </div>
            <span ref={cerrarMenuRef} className={estilos.cerrarMenu}>
              <IconButton icon={X} label="Cerrar menú" onClick={() => setMenuAbierto(false)} className={estilos.botonCerrar} />
            </span>
          </div>
          <nav aria-label="Panel" className={estilos.nav}>
            {secciones.map((s) => {
              const esActiva = s.href === activa;
              return (
                <div key={s.id}>
                  {s.separar && <div className={estilos.separador} />}
                  <Link
                    href={s.href}
                    aria-current={esActiva ? 'page' : undefined}
                    className={cx(estilos.seccion, esActiva && estilos.seccionActiva)}
                    onClick={() => setMenuAbierto(false)}
                  >
                    <Icon icono={s.icono} size={20} className={estilos.seccionIcono} />
                    <span>{s.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
          <span className={estilos.relleno} />
          <Link href={rutas.inicio()} className={estilos.sitioPublico} onClick={() => setMenuAbierto(false)}>
            <Icon icono={ExternalLink} size={18} />
            Ver sitio público
          </Link>
        </aside>
        <main className={estilos.principal}>{children}</main>
      </div>
    </div>
  );
}
