/** Minúsculas y sin tildes, para ids y para buscar sin distinguir mayúsculas ni acentos. */
export function sinTildes(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Texto en minúsculas, sin tildes y con guiones: `Martín Rodríguez` da `martin-rodriguez`. */
export function slug(texto: string): string {
  return sinTildes(texto)
    .replace(/[^a-z0-9_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
