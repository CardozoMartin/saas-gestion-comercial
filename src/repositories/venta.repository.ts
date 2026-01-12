import { prisma } from '@config/database';
import { IVenta, ICreateVenta, IUpdateVenta, IVentaDetalle, ICreateVentaDetalle, IUpdateVentaDetalle } from '@/types/venta.types';

export class VentaRepository {

    async findAll(): Promise<IVenta[]> {
        return await prisma.venta.findMany({
            select: {
                id: true,
                numeroVenta: true,
                clienteId: true,
                usuarioId: true,
                tipoVenta: true,
                subtotal: true,
                descuento: true,
                total: true,
                estado: true,
                observaciones: true,
                fechaVenta: true
            }
        });
    }

    async findById(id: number): Promise<IVenta | null> {
        return await prisma.venta.findUnique({
            where: { id },
            select: {
                id: true,
                numeroVenta: true,
                clienteId: true,
                usuarioId: true,
                tipoVenta: true,
                subtotal: true,
                descuento: true,
                total: true,
                estado: true,
                observaciones: true,
                fechaVenta: true
            }
        });
    }

    async findByNumeroVenta(numeroVenta: string): Promise<IVenta | null> {
        return await prisma.venta.findFirst({
            where: { numeroVenta }
        });
    }

    async create(data: ICreateVenta): Promise<IVenta> {
        return await prisma.venta.create({
            data: {
                numeroVenta: data.numeroVenta,
                clienteId: data.clienteId || null,
                usuarioId: data.usuarioId,
                tipoVenta: data.tipoVenta,
                subtotal: data.subtotal,
                descuento: data.descuento || 0,
                total: data.total,
                estado: data.estado || 'pendiente',
                observaciones: data.observaciones || null,
                fechaVenta: new Date()
            },
            select: {
                id: true,
                numeroVenta: true,
                clienteId: true,
                usuarioId: true,
                tipoVenta: true,
                subtotal: true,
                descuento: true,
                total: true,
                estado: true,
                observaciones: true,
                fechaVenta: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateVenta>): Promise<IVenta> {
        return await prisma.venta.update({
            where: { id },
            data,
            select: {
                id: true,
                numeroVenta: true,
                clienteId: true,
                usuarioId: true,
                tipoVenta: true,
                subtotal: true,
                descuento: true,
                total: true,
                estado: true,
                observaciones: true,
                fechaVenta: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.venta.delete({
            where: { id }
        });
    }
}

export class VentaDetalleRepository {

    async findAll(): Promise<IVentaDetalle[]> {
        return await prisma.ventaDetalle.findMany({
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true
            }
        });
    }

    async findById(id: number): Promise<IVentaDetalle | null> {
        return await prisma.ventaDetalle.findUnique({
            where: { id },
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true
            }
        });
    }

    async findByVentaId(ventaId: number): Promise<IVentaDetalle[]> {
        return await prisma.ventaDetalle.findMany({
            where: { ventaId },
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true
            }
        });
    }

    async create(data: ICreateVentaDetalle): Promise<IVentaDetalle> {
        return await prisma.ventaDetalle.create({
            data: {
                ventaId: data.ventaId,
                productoId: data.productoId,
                unidadMedidaId: data.unidadMedidaId,
                cantidad: data.cantidad,
                precioUnitario: data.precioUnitario,
                subtotal: data.subtotal
            },
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateVentaDetalle>): Promise<IVentaDetalle> {
        return await prisma.ventaDetalle.update({
            where: { id },
            data,
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.ventaDetalle.delete({
            where: { id }
        });
    }
}

export const ventaRepository = new VentaRepository();
export const ventaDetalleRepository = new VentaDetalleRepository();
