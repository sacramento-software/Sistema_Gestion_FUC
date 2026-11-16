import type { ReactNode } from 'react';
import { BloqueLogo } from './BloqueLogo';
import { BotonSesion, NavEscritorio, NavInferior } from './NavPublica';
import { OcultarEnIngreso } from './OcultarEnIngreso';
import { PiePublico } from './PiePublico';
import { SelectorTema } from './SelectorTema';
import { leerTema } from '@/lib/tema';
import type { UsuarioDemo } from '@/lib/roles';
import { rutas } from '@/lib/rutas';
import estilos from './CascaraPublica.module.css';

export interface CascaraPublicaProps {
  usuario: UsuarioDemo | null;
  hayEnVivo: boolean;
  /** Ruta de la serie en vivo, para marcar «En vivo» en el menú cuando se está en ella. */
  rutaEnVivo?: string | null;
  children?: ReactNode;
}

export async function CascaraPublica({ usuario, hayEnVivo, rutaEnVivo = null, children }: CascaraPublicaProps) {
  const tema = await leerTema();
  return (
    <div className={estilos.raiz} data-theme={tema} data-envolvente-tema>
      <header className={estilos.encabezado}>
        <div className={estilos.franja} />
        <div className={estilos.fila}>
          <BloqueLogo href={rutas.inicio()} etiqueta="Federación Uruguaya de Canotaje, inicio" corte="publico" />
          <NavEscritorio hayEnVivo={hayEnVivo} rutaEnVivo={rutaEnVivo} />
          <div className={estilos.acciones}>
            <SelectorTema temaInicial={tema} />
            <BotonSesion inicioPanel={usuario ? usuario.inicio : null} />
          </div>
        </div>
      </header>
      <main className={estilos.principal}>{children}</main>
      <OcultarEnIngreso>
        <PiePublico />
      </OcultarEnIngreso>
      <NavInferior hayEnVivo={hayEnVivo} rutaEnVivo={rutaEnVivo} />
    </div>
  );
}
