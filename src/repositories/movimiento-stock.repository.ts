import { prisma } from '@config/database';
import { IMovimientoStock, ICreateMovimientoStock, IUpdateMovimientoStock, IStockActual, ICreateStockActual, IUpdateStockActual } from '@/types/movimiento-stock.types';

export class MovimientoStockRepository {

    async findAll(): Promise<IMovimientoStock[]> {
        return await prisma.movimientoStock.findMany({
            select: {
                id: true,
                productoId: true,
                tipoMovimiento: true,
                cantidad: true,
                motivo: true,
                usuarioId: true,
                referenciaId: true,
                referenciaTipo: true,
                fechaMovimiento: true
            }
        });
    }

    async findById(id: number): Promise<IMovimientoStock | null> {
        return await prisma.movimientoStock.findUnique({
            where: { id },
            select: {
                id: true,
                productoId: true,
                tipoMovimiento: true,
                cantidad: true,
                motivo: true,
                usuarioId: true,
                referenciaId: true,
                referenciaTipo: true,
                fechaMovimiento: true
            }
        });
    }

    async findByProductoId(productoId: number): Promise<IMovimientoStock[]> {
        return await prisma.movimientoStock.findMany({
            where: { productoId },
            select: {
                id: true,
                productoId: true,
                tipoMovimiento: true,
                cantidad: true,
                motivo: true,
                usuarioId: true,
                referenciaId: true,
                referenciaTipo: true,
                fechaMovimiento: true
            }
        });
    }

    async create(data: ICreateMovimientoStock): Promise<IMovimientoStock> {
        return await prisma.movimientoStock.create({
            data: {
                productoId: data.productoId,
                tipoMovimiento: data.tipoMovimiento,
                cantidad: data.cantidad,
                motivo: data.motivo || null,
                usuarioId: data.usuarioId,
                referenciaId: data.referenciaId || null,
                referenciaTipo: data.referenciaTipo || null
            },
            select: {
                id: true,
                productoId: true,
                tipoMovimiento: true,
                cantidad: true,
                motivo: true,
                usuarioId: true,
                referenciaId: true,
                referenciaTipo: true,
                fechaMovimiento: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateMovimientoStock>): Promise<IMovimientoStock> {
        return await prisma.movimientoStock.update({
            where: { id },
            data,
            select: {
                id: true,
                productoId: true,
                tipoMovimiento: true,
                cantidad: true,
                motivo: true,
                usuarioId: true,
                referenciaId: true,
                referenciaTipo: true,
                fechaMovimiento: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.movimientoStock.delete({
            where: { id }
        });
    }
}

export class StockActualRepository {

    async findAll(): Promise<IStockActual[]> {
        return await prisma.stockActual.findMany({
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }

    async findById(id: number): Promise<IStockActual | null> {
        return await prisma.stockActual.findUnique({
            where: { id },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }

    async findByProductoId(productoId: number): Promise<IStockActual | null> {
        return await prisma.stockActual.findFirst({
            where: { productoId },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }

    async create(data: ICreateStockActual): Promise<IStockActual> {
        return await prisma.stockActual.create({
            data: {
                productoId: data.productoId,
                cantidad: data.cantidad || 0
            },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateStockActual>): Promise<IStockActual> {
        return await prisma.stockActual.update({
            where: { id },
            data,
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.stockActual.delete({
            where: { id }
        });
    }
}
