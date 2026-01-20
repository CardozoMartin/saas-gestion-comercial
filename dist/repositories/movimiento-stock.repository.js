"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockActualRepository = exports.MovimientoStockRepository = void 0;
const database_1 = require("@config/database");
class MovimientoStockRepository {
    async findAll() {
        return await database_1.prisma.movimientoStock.findMany({
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
    async findById(id) {
        return await database_1.prisma.movimientoStock.findUnique({
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
    async findByProductoId(productoId) {
        return await database_1.prisma.movimientoStock.findMany({
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
    async create(data) {
        return await database_1.prisma.movimientoStock.create({
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
    async update(id, data) {
        return await database_1.prisma.movimientoStock.update({
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
    async delete(id) {
        await database_1.prisma.movimientoStock.delete({
            where: { id }
        });
    }
}
exports.MovimientoStockRepository = MovimientoStockRepository;
class StockActualRepository {
    async findAll() {
        return await database_1.prisma.stockActual.findMany({
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.stockActual.findUnique({
            where: { id },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }
    async findByProductoId(productoId) {
        return await database_1.prisma.stockActual.findFirst({
            where: { productoId },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
                fechaActualizacion: true
            }
        });
    }
    async create(data) {
        return await database_1.prisma.stockActual.create({
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
    async update(id, data) {
        return await database_1.prisma.stockActual.update({
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
    async delete(id) {
        await database_1.prisma.stockActual.delete({
            where: { id }
        });
    }
}
exports.StockActualRepository = StockActualRepository;
