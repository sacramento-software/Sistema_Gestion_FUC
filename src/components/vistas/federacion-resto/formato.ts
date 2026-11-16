/** «$ 12.000». Separador de miles con punto, sin depender de la configuración regional del servidor. */
export function pesos(monto: number): string {
  return `$ ${Math.round(monto)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/** «1 club» / «3 clubes». */
export function cantidadDe(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
