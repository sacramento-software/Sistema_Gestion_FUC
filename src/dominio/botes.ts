import type { CategoriaId, FechaISO, FichaMedica, Genero, Sexo } from '@/datos/tipos';
import { categoriaEnTemporada, nombreCategoria } from './categorias';
import { estadoFicha } from './ficha-medica';

/** K1: «Martín Rodríguez»; K2: «Valentina Ríos y Camila Suárez»; K4: «A, B, C y D». */
export function nombreBote(deportistas: { nombre: string; apellido: string }[]): string {
  const completos = deportistas.map((d) => `${d.nombre} ${d.apellido}`);
  const ultimo = completos.pop();
  if (completos.length === 0) return ultimo ?? '';
  return `${completos.join(', ')} y ${ultimo}`;
}

/** Apellidos con « / » (K1: el nombre completo). */
export function nombreCortoBote(deportistas: { nombre: string; apellido: string }[]): string {
  if (deportistas.length === 1) return `${deportistas[0].nombre} ${deportistas[0].apellido}`;
  return deportistas.map((d) => d.apellido).join(' / ');
}

export interface AvisoInscripcion {
  tipo: 'ficha-vencida' | 'categoria-distinta' | 'sexo-distinto';
  texto: string;
}

/** Avisos que no bloquean: son solo información para el delegado. Una ficha en trámite no avisa. */
export function avisosParaEvento(
  deportista: { edad: number; sexo: Sexo; fichaMedica: FichaMedica },
  evento: { categoriaId: CategoriaId; genero: Genero },
  hoy?: FechaISO,
): AvisoInscripcion[] {
  const avisos: AvisoInscripcion[] = [];
  if (estadoFicha(deportista.fichaMedica) === 'vencida') {
    avisos.push({ tipo: 'ficha-vencida', texto: 'Ficha médica vencida.' });
  }
  const categoria = categoriaEnTemporada(deportista, hoy);
  if (categoria !== evento.categoriaId) {
    const propia = categoria ? nombreCategoria(categoria) : 'sin categoría';
    avisos.push({
      tipo: 'categoria-distinta',
      texto: `Categoría ${propia}; el evento es ${nombreCategoria(evento.categoriaId)}.`,
    });
  }
  if (evento.genero !== 'X' && deportista.sexo !== evento.genero) {
    avisos.push({ tipo: 'sexo-distinto', texto: 'Sexo distinto al del evento.' });
  }
  return avisos;
}
