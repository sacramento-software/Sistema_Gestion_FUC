/** Valor de un parámetro de URL: si viene repetido, el primero. */
export function primero(valor: string | string[] | undefined): string | undefined {
  const elegido = Array.isArray(valor) ? valor[0] : valor;
  return elegido && elegido.trim() ? elegido.trim() : undefined;
}

/** Arma `base?a=1&b=2` omitiendo los parámetros vacíos. */
export function armarUrl(base: string, params: Record<string, string | undefined>): string {
  const consulta = new URLSearchParams();
  for (const [clave, valor] of Object.entries(params)) {
    if (valor) consulta.set(clave, valor);
  }
  const texto = consulta.toString();
  return texto ? `${base}?${texto}` : base;
}
