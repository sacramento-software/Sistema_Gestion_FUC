import { CascaraPublica, Contenedor } from '@/components/cascaras';
import { Button } from '@/components/ds';
import { rutas } from '@/lib/rutas';
import { obtenerSesion } from '@/lib/sesion';
import estilos from './mensaje.module.css';

export default async function NoEncontrada() {
  const usuario = await obtenerSesion();
  return (
    <CascaraPublica usuario={usuario} hayEnVivo={false}>
      <Contenedor className={estilos.contenedor}>
        <p className={estilos.titulo}>No encontramos esta página.</p>
        <p className={estilos.texto}>Puede que el enlace esté mal escrito o que la página ya no exista.</p>
        <Button href={rutas.inicio()}>Volver al inicio</Button>
      </Contenedor>
    </CascaraPublica>
  );
}
