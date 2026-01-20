"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountTransactionRepository = exports.AccountTransactionRepository = void 0;
const database_1 = require("@/config/database");
class AccountTransactionRepository {
    async findAll() {
        return await database_1.prisma.movimientoCuentaCorriente.findMany({
            select: {
                id: true,
                cuentaCorrienteId: true,
                tipoMovimiento: true,
                monto: true,
                saldoAnterior: true,
                saldoNuevo: true,
                ventaId: true,
                pagoId: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.movimientoCuentaCorriente.findUnique({
            where: { id },
            select: {
                id: true,
                cuentaCorrienteId: true,
                tipoMovimiento: true,
                monto: true,
                saldoAnterior: true,
                saldoNuevo: true,
                ventaId: true,
                pagoId: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }
    async create(data) {
        return await database_1.prisma.movimientoCuentaCorriente.create({
            data: {
                cuentaCorrienteId: data.cuentaCorrienteId,
                tipoMovimiento: data.tipoMovimiento,
                monto: data.monto,
                saldoAnterior: data.saldoAnterior,
                saldoNuevo: data.saldoNuevo,
                ventaId: data.ventaId || null,
                pagoId: data.pagoId || null,
                descripcion: data.descripcion,
                fechaMovimiento: data.fechaMovimiento
            },
            select: {
                cuentaCorrienteId: true,
                tipoMovimiento: true,
                monto: true,
                saldoAnterior: true,
                saldoNuevo: true,
                ventaId: true,
                pagoId: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }
    async update(id, data) {
        return await database_1.prisma.movimientoCuentaCorriente.update({
            where: { id },
            data,
            select: {
                id: true,
                cuentaCorrienteId: true,
                tipoMovimiento: true,
                monto: true,
                saldoAnterior: true,
                saldoNuevo: true,
                ventaId: true,
                pagoId: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }
    async delete(id) {
        await database_1.prisma.movimientoCuentaCorriente.delete({
            where: { id }
        });
    }
}
exports.AccountTransactionRepository = AccountTransactionRepository;
exports.accountTransactionRepository = new AccountTransactionRepository();
