import {
  Calendar,
  ClipboardList,
  House,
  LayoutDashboard,
  Library,
  ListOrdered,
  Settings,
  ShieldCheck,
  Timer,
  Trophy,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export type Rol = 'federacion' | 'delegado' | 'juez';

export interface UsuarioDemo {
  rol: Rol;
  usuario: string;
  nombre: string;
  rolTexto: string;
  iniciales: string;
  etiquetaPanel: string;
  contextoPanel: string;
  inicio: string;
  clubId?: string;
}

export const CLUB_DELEGADO_ID = 'acal-nautico-club';

export const USUARIOS_DEMO: Record<Rol, UsuarioDemo> = {
  federacion: {
    rol: 'federacion',
    usuario: 'admin',
    nombre: 'Sebastián Gómez',
    rolTexto: 'Federación',
    iniciales: 'SG',
    etiquetaPanel: 'Federación',
    contextoPanel: 'Administración',
    inicio: '/panel/federacion',
  },
  delegado: {
    rol: 'delegado',
    usuario: 'delegado',
    nombre: 'Pablo Suárez',
    rolTexto: 'Delegado de ACAL Náutico Club',
    iniciales: 'PS',
    etiquetaPanel: 'Delegado',
    contextoPanel: 'ACAL Náutico Club',
    inicio: '/panel/delegado',
    clubId: CLUB_DELEGADO_ID,
  },
  juez: {
    rol: 'juez',
    usuario: 'juez',
    nombre: 'Carla Viera',
    rolTexto: 'Juez central',
    iniciales: 'CV',
    etiquetaPanel: 'Juez central',
    contextoPanel: 'Jornada de competencia',
    inicio: '/panel/juez',
  },
};

export interface SeccionPanel {
  id: string;
  label: string;
  href: string;
  icono: LucideIcon;
  separar?: boolean;
}

export const SECCIONES_PANEL: Record<Rol, SeccionPanel[]> = {
  federacion: [
    { id: 'tablero', label: 'Tablero', href: '/panel/federacion', icono: LayoutDashboard },
    { id: 'competencias', label: 'Competencias', href: '/panel/federacion/competencias', icono: Calendar },
    { id: 'catalogo', label: 'Catálogo de eventos', href: '/panel/federacion/catalogo', icono: Library },
    { id: 'clubes', label: 'Clubes y delegados', href: '/panel/federacion/clubes', icono: Users },
    { id: 'jueces', label: 'Jueces y equipo', href: '/panel/federacion/jueces', icono: ShieldCheck },
    { id: 'contabilidad', label: 'Contabilidad', href: '/panel/federacion/contabilidad', icono: Wallet },
    { id: 'estadisticas', label: 'Estadísticas', href: '/panel/federacion/estadisticas', icono: TrendingUp },
    {
      id: 'configuracion',
      label: 'Configuración',
      href: '/panel/federacion/configuracion',
      icono: Settings,
      separar: true,
    },
  ],
  delegado: [
    { id: 'inicio', label: 'Inicio', href: '/panel/delegado', icono: House },
    { id: 'competencias', label: 'Competencias abiertas', href: '/panel/delegado/competencias', icono: Calendar },
    { id: 'deportistas', label: 'Mis deportistas', href: '/panel/delegado/deportistas', icono: Users },
    { id: 'inscripciones', label: 'Mis inscripciones', href: '/panel/delegado/inscripciones', icono: ClipboardList },
  ],
  juez: [
    { id: 'jornada', label: 'Jornada', href: '/panel/juez', icono: Timer },
    { id: 'armado', label: 'Armado de series', href: '/panel/juez/armado', icono: ListOrdered },
    { id: 'resultados', label: 'Resultados', href: '/panel/juez/resultados', icono: Trophy },
  ],
};
