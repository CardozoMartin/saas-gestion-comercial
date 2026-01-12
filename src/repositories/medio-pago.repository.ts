import { prisma } from '@config/database';
import { IMedioPago, ICreateMedioPago, IUpdateMedioPago, IPago, ICreatePago, IUpdatePago } from '@/types/medio-pago.types';

export class MedioPagoRepository {

    async findAll(): Promise<IMedioPago[]> {
        return await prisma.medioPago.findMany({
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }

    async findById(id: number): Promise<IMedioPago | null> {
        return await prisma.medioPago.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }

    async findByNombre(nombre: string): Promise<IMedioPago | null> {
        return await prisma.medioPago.findFirst({
            where: { nombre }
        });
    }

    async create(data: ICreateMedioPago): Promise<IMedioPago> {
        return await prisma.medioPago.create({
            data: {
                nombre: data.nombre,
                requiereReferencia: data.requiereReferencia || false
            },
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateMedioPago>): Promise<IMedioPago> {
        return await prisma.medioPago.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.medioPago.delete({
            where: { id }
        });
    }
}

export class PagoRepository {

    async findAll(): Promise<IPago[]> {
        return await prisma.pago.findMany({
            select: {
                id: true,
                ventaId: true,
                clienteId: true,
                medioPagoId: true,
                monto: true,
                referencia: true,
                usuarioId: true,
                fechaPago: true,
                observaciones: true
            }
        });
    }

    async findById(id: number): Promise<IPago | null> {
        return await prisma.pago.findUnique({
            where: { id },
            select: {
                id: true,
                ventaId: true,
                clienteId: true,
                medioPagoId: true,
                monto: true,
                referencia: true,
                usuarioId: true,
                fechaPago: true,
                observaciones: true
            }
        });
    }

    async findByVentaId(ventaId: number): Promise<IPago[]> {
        return await prisma.pago.findMany({
            where: { ventaId },
            select: {
                id: true,
                ventaId: true,
                clienteId: true,
                medioPagoId: true,
                monto: true,
                referencia: true,
                usuarioId: true,
                fechaPago: true,
                observaciones: true
            }
        });
    }

    async create(data: ICreatePago): Promise<IPago> {
        return await prisma.pago.create({
            data: {
                ventaId: data.ventaId || null,
                clienteId: data.clienteId || null,
                medioPagoId: data.medioPagoId,
                monto: data.monto,
                referencia: data.referencia || null,
                usuarioId: data.usuarioId,
                observaciones: data.observaciones || null
            },
            select: {
                id: true,
                ventaId: true,
                clienteId: true,
                medioPagoId: true,
                monto: true,
                referencia: true,
                usuarioId: true,
                fechaPago: true,
                observaciones: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdatePago>): Promise<IPago> {
        return await prisma.pago.update({
            where: { id },
            data,
            select: {
                id: true,
                ventaId: true,
                clienteId: true,
                medioPagoId: true,
                monto: true,
                referencia: true,
                usuarioId: true,
                fechaPago: true,
                observaciones: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.pago.delete({
            where: { id }
        });
    }
}

export const medioPagoRepository = new MedioPagoRepository();
export const pagoRepository = new PagoRepository();