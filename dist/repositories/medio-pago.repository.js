"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagoRepository = exports.medioPagoRepository = exports.PagoRepository = exports.MedioPagoRepository = void 0;
const database_1 = require("@config/database");
class MedioPagoRepository {
    async findAll() {
        return await database_1.prisma.medioPago.findMany({
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.medioPago.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }
    async findByNombre(nombre) {
        return await database_1.prisma.medioPago.findFirst({
            where: { nombre }
        });
    }
    async create(data) {
        return await database_1.prisma.medioPago.create({
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
    async update(id, data) {
        return await database_1.prisma.medioPago.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                requiereReferencia: true
            }
        });
    }
    async delete(id) {
        await database_1.prisma.medioPago.delete({
            where: { id }
        });
    }
}
exports.MedioPagoRepository = MedioPagoRepository;
class PagoRepository {
    async findAll() {
        return await database_1.prisma.pago.findMany({
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
    async findById(id) {
        return await database_1.prisma.pago.findUnique({
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
    async findByVentaId(ventaId) {
        return await database_1.prisma.pago.findMany({
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
    async create(data) {
        return await database_1.prisma.pago.create({
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
    async update(id, data) {
        return await database_1.prisma.pago.update({
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
    async delete(id) {
        await database_1.prisma.pago.delete({
            where: { id }
        });
    }
}
exports.PagoRepository = PagoRepository;
exports.medioPagoRepository = new MedioPagoRepository();
exports.pagoRepository = new PagoRepository();
