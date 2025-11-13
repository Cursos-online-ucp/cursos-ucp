import { z } from 'zod';

export const programarDescuentoSchema = z.object({
  precio_promocional: z.preprocess(
    v => typeof v === 'string' ? Number(v) : v,
    z.number().positive().max(9_999_999)
  ),
  descuento_desde: z.coerce.date(),
  descuento_hasta: z.coerce.date()
})
.refine(data => data.descuento_hasta > data.descuento_desde, {
  message: "descuento_hasta debe ser mayor que descuento_desde",
  path: ['descuento_hasta']
});
