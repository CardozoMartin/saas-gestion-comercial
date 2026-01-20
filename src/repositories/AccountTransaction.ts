import { prisma } from "../config/database";
import { IMovimientoCuentaCorriente, ICreateMovimientoCuentaCorriente, IUpdateMovimientoCuentaCorriente } from "@/types/accounteTrans.types";

export class AccountTransactionRepository {

    async findAll(): Promise<IMovimientoCuentaCorriente[]> {
        return await prisma.movimientoCuentaCorriente.findMany({
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
    async findById(id: number): Promise<IMovimientoCuentaCorriente | null> {
        return await prisma.movimientoCuentaCorriente.findUnique({
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
    async create(data: ICreateMovimientoCuentaCorriente): Promise<IMovimientoCuentaCorriente> {
        return await prisma.movimientoCuentaCorriente.create({
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
    async update(id: number, data: Partial<IUpdateMovimientoCuentaCorriente>): Promise<IMovimientoCuentaCorriente> {
        return await prisma.movimientoCuentaCorriente.update({
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

    async delete(id: number): Promise<void> {
        await prisma.movimientoCuentaCorriente.delete({
            where: { id }
        });
    }
}

export const accountTransactionRepository = new AccountTransactionRepository();