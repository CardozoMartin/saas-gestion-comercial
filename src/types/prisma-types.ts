// Decimal type is provided at runtime by Prisma (decimal.js). Use a flexible alias for typing
export type DecimalJS = any;
export type Numeric = number | DecimalJS;

export type TipoMovimientoCaja = import('@prisma/client').$Enums.TipoMovimientoCaja;
export type TipoMovimientoCuenta = import('@prisma/client').$Enums.TipoMovimientoCuenta;
export type TipoVenta = import('@prisma/client').$Enums.TipoVenta;
export type EstadoVenta = import('@prisma/client').$Enums.EstadoVenta;
export type TipoMovimientoStock = import('@prisma/client').$Enums.TipoMovimientoStock;
