// model MovimientoCuentaCorriente {
//   id                  Int                    @id @default(autoincrement())
//   cuentaCorrienteId   Int                    @map("cuenta_corriente_id")
//   tipoMovimiento      TipoMovimientoCuenta   @map("tipo_movimiento")
//   monto               Decimal                @db.Decimal(10, 2)
//   saldoAnterior       Decimal                @map("saldo_anterior") @db.Decimal(10, 2)
//   saldoNuevo          Decimal                @map("saldo_nuevo") @db.Decimal(10, 2)
//   ventaId             Int?                   @map("venta_id")
//   pagoId              Int?                   @map("pago_id")
//   descripcion         String?                @db.Text
//   fechaMovimiento     DateTime               @default(now()) @map("fecha_movimiento")

//   cuentaCorriente     CuentaCorriente @relation(fields: [cuentaCorrienteId], references: [id])
//   venta               Venta?   @relation(fields: [ventaId], references: [id])
//   pago                Pago?    @relation(fields: [pagoId], references: [id])

//   @@map("movimientos_cuenta_corriente")
// }

export interface IMovimientoCuentaCorriente {
    id: number;
    cuentaCorrienteId: number;
    tipoMovimiento: 'cuenta_corriente' | 'contado' | 'transferencia'
    monto: number;
    saldoAnterior: number;
    saldoNuevo: number;
    ventaId?: number | null;
    pagoId?: number | null;
    descripcion?: string | null;
    fechaMovimiento: Date;
}
export interface ICreateMovimientoCuentaCorriente {
    cuentaCorrienteId: number;
    tipoMovimiento: 'cuenta_corriente' | 'contado' | 'transferencia'
    monto: number;
    saldoAnterior: number;
    saldoNuevo: number;
    ventaId?: number | null;
    pagoId?: number | null;
    descripcion?: string | null;
}
export interface IUpdateMovimientoCuentaCorriente {
    tipoMovimiento?: 'cuenta_corriente' | 'contado' | 'transferencia'
    monto?: number;
    saldoAnterior?: number;
    saldoNuevo?: number;
    ventaId?: number | null;
    pagoId?: number | null;
    descripcion?: string | null;
}