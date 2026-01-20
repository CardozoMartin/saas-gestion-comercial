"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
