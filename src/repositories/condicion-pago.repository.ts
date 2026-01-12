import { prisma } from '@config/database';
import { ICondicionPago, ICreateCondicionPago, IUpdateCondicionPago, ICuentaCorriente, ICreateCuentaCorriente, IUpdateCuentaCorriente } from '@/types/condicion-pago.types';

export class CondicionPagoRepository {

    async findAll(): Promise<ICondicionPago[]> {
        return await prisma.condicionPago.findMany({
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }

    async findById(id: number): Promise<ICondicionPago | null> {
        return await prisma.condicionPago.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }

    async findByNombre(nombre: string): Promise<ICondicionPago | null> {
        return await prisma.condicionPago.findFirst({
            where: { nombre }
        });
    }

    async create(data: ICreateCondicionPago): Promise<ICondicionPago> {
        return await prisma.condicionPago.create({
            data: {
                nombre: data.nombre,
                dias: data.dias
            },
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCondicionPago>): Promise<ICondicionPago> {
        return await prisma.condicionPago.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.condicionPago.delete({
            where: { id }
        });
    }
}

export class CuentaCorrienteRepository {

    async findAll(): Promise<ICuentaCorriente[]> {
        return await prisma.cuentaCorriente.findMany({
            select: {
                id: true,
                clienteId: true,
                saldoActual: true,
                condicionPagoId: true,
                fechaProximoVencimiento: true,
                fechaActualizacion: true
            }
        });
    }

    async findById(id: number): Promise<ICuentaCorriente | null> {
        return await prisma.cuentaCorriente.findUnique({
            where: { id },
            select: {
                id: true,
                clienteId: true,
                saldoActual: true,
                condicionPagoId: true,
                fechaProximoVencimiento: true,
                fechaActualizacion: true
            }
        });
    }

    async findByClienteId(clienteId: number): Promise<ICuentaCorriente | null> {
        return await prisma.cuentaCorriente.findFirst({
            where: { clienteId },
            select: {
                id: true,
                clienteId: true,
                saldoActual: true,
                condicionPagoId: true,
                fechaProximoVencimiento: true,
                fechaActualizacion: true
            }
        });
    }

    async create(data: ICreateCuentaCorriente): Promise<ICuentaCorriente> {
        return await prisma.cuentaCorriente.create({
            data: {
                clienteId: data.clienteId,
                saldoActual: data.saldoActual || 0,
                condicionPagoId: data.condicionPagoId || null,
                fechaProximoVencimiento: data.fechaProximoVencimiento || null
            },
            select: {
                id: true,
                clienteId: true,
                saldoActual: true,
                condicionPagoId: true,
                fechaProximoVencimiento: true,
                fechaActualizacion: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCuentaCorriente>): Promise<ICuentaCorriente> {
        return await prisma.cuentaCorriente.update({
            where: { id },
            data,
            select: {
                id: true,
                clienteId: true,
                saldoActual: true,
                condicionPagoId: true,
                fechaProximoVencimiento: true,
                fechaActualizacion: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.cuentaCorriente.delete({
            where: { id }
        });
    }
}
