import { Contenedor } from '@/components/cascaras';
import estilos from './page.module.css';

// Página provisoria: la reemplaza la spec 4.
export default function InicioPage() {
  return (
    <Contenedor ancho="amplio" className={estilos.portada}>
      <h1 className={estilos.titulo}>Federación Uruguaya de Canotaje</h1>
      <p className={estilos.bajada}>Competencias, resultados y rankings del canotaje uruguayo.</p>
    </Contenedor>
  );
}
