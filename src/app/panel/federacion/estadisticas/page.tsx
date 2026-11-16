import { EncabezadoPanel } from '@/components/cascaras';
import { GraficoBarras, Metrica } from '@/components/vistas/federacion-resto/Bloques';
import {
  botesPorClub,
  deportistasPorSexo,
  participacionPorCategoria,
  seriesCorridas,
  totalBotes,
} from '@/components/vistas/federacion-resto/calculos';
import estilos from '@/components/vistas/federacion-resto/federacion-resto.module.css';
import { listarClubes, listarCompetencias, listarDeportistas } from '@/datos';
import { botesTemporadasAnteriores } from '@/datos/extra/08-federacion-resto';
import { anioTemporada, hoyDemoISO } from '@/dominio';

export default function EstadisticasPage() {
  const anio = anioTemporada(hoyDemoISO());
  const sexo = deportistasPorSexo();

  // Las cuatro temporadas anteriores son datos propios; la actual se calcula.
  const evolucion = [
    ...botesTemporadasAnteriores.map((botes, i) => ({
      etiqueta: String(anio - botesTemporadasAnteriores.length + i),
      valor: botes,
    })),
    { etiqueta: String(anio), valor: totalBotes() },
  ];

  return (
    <>
      <EncabezadoPanel titulo="Estadísticas" subtitulo={`Temporada ${anio}`} />
      <div className={estilos.pagina}>
        <div className={estilos.metricas}>
          <Metrica etiqueta="Deportistas federados" valor={listarDeportistas().length} />
          <Metrica etiqueta="Clubes" valor={listarClubes().length} />
          <Metrica etiqueta="Competencias" valor={listarCompetencias().length} />
          <Metrica etiqueta="Series corridas" valor={seriesCorridas()} />
        </div>

        <div className={estilos.graficos}>
          <GraficoBarras
            verDetalles
            titulo="Participación por categoría"
            datos={participacionPorCategoria().map((c) => ({ etiqueta: c.nombre, valor: c.deportistas }))}
            nota="Deportistas distintos que compitieron en la temporada."
          />
          <GraficoBarras
            verDetalles
            titulo="Participación por club"
            datos={botesPorClub().map((c) => ({ etiqueta: c.nombre, valor: c.botes }))}
            nota="Botes inscriptos en la temporada."
          />
          <GraficoBarras
            verDetalles
            titulo="Deportistas por sexo"
            datos={[
              { etiqueta: 'Femenino', valor: sexo.femenino },
              { etiqueta: 'Masculino', valor: sexo.masculino },
            ]}
          />
          <GraficoBarras
            verDetalles
            titulo="Evolución de inscriptos por temporada"
            datos={evolucion}
            nota="Botes inscriptos en cada temporada."
          />
        </div>
      </div>
    </>
  );
}
