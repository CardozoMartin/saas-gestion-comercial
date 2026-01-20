"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventaDetalleRepository = exports.ventaRepository = exports.VentaDetalleRepository = exports.VentaRepository = void 0;
const database_1 = require("@config/database");
class VentaRepository {
    async findAll() {
        return await database_1.prisma.venta.findMany({
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
                fechaVenta: true,
            },
        });
    }
    async findById(id) {
        return await database_1.prisma.venta.findUnique({
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
                fechaVenta: true,
            },
        });
    }
    async findByNumeroVenta(numeroVenta) {
        return await database_1.prisma.venta.findFirst({
            where: { numeroVenta },
        });
    }
    async create(data) {
        return await database_1.prisma.venta.create({
            data: {
                numeroVenta: data.numeroVenta,
                clienteId: data.clienteId || null,
                usuarioId: data.usuarioId,
                tipoVenta: data.tipoVenta,
                subtotal: data.subtotal,
                descuento: data.descuento || 0,
                total: data.total,
                estado: data.estado || "pendiente",
                observaciones: data.observaciones || null,
                fechaVenta: new Date(),
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
                fechaVenta: true,
            },
        });
    }
    async update(id, data) {
        return await database_1.prisma.venta.update({
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
                fechaVenta: true,
            },
        });
    }
    async delete(id) {
        await database_1.prisma.venta.delete({
            where: { id },
        });
    }
}
exports.VentaRepository = VentaRepository;
class VentaDetalleRepository {
    async findAll() {
        return await database_1.prisma.ventaDetalle.findMany({
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true,
            },
        });
    }
    async findById(id) {
        return await database_1.prisma.ventaDetalle.findUnique({
            where: { id },
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true,
            },
        });
    }
    async findByVentaId(ventaId) {
        return await database_1.prisma.ventaDetalle.findMany({
            where: { ventaId },
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true,
            },
        });
    }
    async create(data) {
        return await database_1.prisma.ventaDetalle.create({
            data: {
                ventaId: data.ventaId,
                productoId: data.productoId,
                unidadMedidaId: data.unidadMedidaId,
                cantidad: data.cantidad,
                precioUnitario: data.precioUnitario,
                subtotal: data.subtotal,
            },
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true,
            },
        });
    }
    async update(id, data) {
        return await database_1.prisma.ventaDetalle.update({
            where: { id },
            data,
            select: {
                id: true,
                ventaId: true,
                productoId: true,
                unidadMedidaId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true,
            },
        });
    }
    async delete(id) {
        await database_1.prisma.ventaDetalle.delete({
            where: { id },
        });
    }
}
exports.VentaDetalleRepository = VentaDetalleRepository;
exports.ventaRepository = new VentaRepository();
exports.ventaDetalleRepository = new VentaDetalleRepository();
