"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuentaCorrienteRepository = exports.condicionPagoRepository = exports.CuentaCorrienteRepository = exports.CondicionPagoRepository = void 0;
const database_1 = require("@config/database");
class CondicionPagoRepository {
    async findAll() {
        return await database_1.prisma.condicionPago.findMany({
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.condicionPago.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }
    async findByNombre(nombre) {
        return await database_1.prisma.condicionPago.findFirst({
            where: { nombre }
        });
    }
    async create(data) {
        return await database_1.prisma.condicionPago.create({
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
    async update(id, data) {
        return await database_1.prisma.condicionPago.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                dias: true
            }
        });
    }
    async delete(id) {
        await database_1.prisma.condicionPago.delete({
            where: { id }
        });
    }
}
exports.CondicionPagoRepository = CondicionPagoRepository;
class CuentaCorrienteRepository {
    async findAll() {
        return await database_1.prisma.cuentaCorriente.findMany({
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
    async findById(id) {
        return await database_1.prisma.cuentaCorriente.findUnique({
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
    async findByClienteId(clienteId) {
        return await database_1.prisma.cuentaCorriente.findFirst({
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
    async create(data) {
        return await database_1.prisma.cuentaCorriente.create({
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
    async update(id, data) {
        return await database_1.prisma.cuentaCorriente.update({
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
    async delete(id) {
        await database_1.prisma.cuentaCorriente.delete({
            where: { id }
        });
    }
}
exports.CuentaCorrienteRepository = CuentaCorrienteRepository;
exports.condicionPagoRepository = new CondicionPagoRepository();
exports.cuentaCorrienteRepository = new CuentaCorrienteRepository();
