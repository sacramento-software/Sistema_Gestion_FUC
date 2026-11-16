import { Contenedor } from '@/components/cascaras';
import { Portada, type AccesoPortada } from '@/components/vistas/regata/Portada';
import {
  CintaClubes,
  SeccionCompetencias,
  SeccionDisciplinas,
  SeccionNoticias,
  SeccionResultados,
} from '@/components/vistas/regata/SeccionesInicio';
import { TarjetaEnVivo } from '@/components/vistas/regata/TarjetaEnVivo';
import { competenciaEnCurso, competenciasAbiertas, serieEnVivo } from '@/datos';
import { rutas } from '@/lib/rutas';
import estilos from './page.module.css';

export default function InicioPage() {
  const enVivo = serieEnVivo();
  const abierta = competenciasAbiertas()[0];
  const enCurso = competenciaEnCurso();
  const hrefResultados = enCurso ? `${rutas.competencia(enCurso.id)}?pestana=resultados` : rutas.competencias();

  const proxima: AccesoPortada | undefined = abierta
    ? {
        rotulo: `Próxima competencia · ${abierta.fechas.corta}`,
        titulo: abierta.tipoTexto,
        href: rutas.competencia(abierta.id),
      }
    : undefined;
  const resultados: AccesoPortada | undefined = enCurso
    ? {
        rotulo: 'Últimos resultados',
        titulo: `${enCurso.tipoTexto} ${enCurso.fechaInicio.slice(0, 4)}`,
        href: hrefResultados,
      }
    : undefined;

  return (
    <>
      <Portada proxima={proxima} resultados={resultados} />
      {enVivo && (
        <Contenedor ancho="amplio" className={estilos.enVivo}>
          <TarjetaEnVivo serie={enVivo} conCompetencia />
        </Contenedor>
      )}
      <CintaClubes />
      <SeccionCompetencias />
      <SeccionResultados hrefTodos={hrefResultados} />
      <SeccionNoticias />
      <SeccionDisciplinas />
    </>
  );
}
