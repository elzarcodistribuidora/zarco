// Formato de moneda MXN compartido por los componentes del portal.
const fmt = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const mxn = (n: number) => `$${fmt.format(Number(n) || 0)}`;
