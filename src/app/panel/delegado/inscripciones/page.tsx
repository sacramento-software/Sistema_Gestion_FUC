import { EncabezadoPanel } from '@/components/cascaras';
import { ListaInscripciones } from '@/components/vistas/delegado/Inscripciones';
import { Pagina } from '@/components/vistas/delegado/Piezas';
import { requerirRol } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function InscripcionesDelegadoPage() {
  const usuario = await requerirRol('delegado');
  return (
    <>
      <EncabezadoPanel titulo="Mis inscripciones" />
      <Pagina>
        <ListaInscripciones clubId={usuario.clubId ?? ''} />
      </Pagina>
    </>
  );
}
