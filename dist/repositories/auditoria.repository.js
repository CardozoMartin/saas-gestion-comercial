"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditoriaRepository = exports.AuditoriaRepository = void 0;
const database_1 = require("@config/database");
class AuditoriaRepository {
    async findAll() {
        return await database_1.prisma.auditoria.findMany({
            select: {
                id: true,
                usuarioId: true,
                accion: true,
                tablaAfectada: true,
                registroId: true,
                datosAnteriores: true,
                datosNuevos: true,
                ipAddress: true,
                userAgent: true,
                fechaAccion: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.auditoria.findUnique({
            where: { id },
            select: {
                id: true,
                usuarioId: true,
                accion: true,
                tablaAfectada: true,
                registroId: true,
                datosAnteriores: true,
                datosNuevos: true,
                ipAddress: true,
                userAgent: true,
                fechaAccion: true
            }
        });
    }
    async findByUsuarioId(usuarioId) {
        return await database_1.prisma.auditoria.findMany({
            where: { usuarioId },
            select: {
                id: true,
                usuarioId: true,
                accion: true,
                tablaAfectada: true,
                registroId: true,
                datosAnteriores: true,
                datosNuevos: true,
                ipAddress: true,
                userAgent: true,
                fechaAccion: true
            }
        });
    }
    async create(data) {
        return await database_1.prisma.auditoria.create({
            data: {
                usuarioId: data.usuarioId,
                accion: data.accion,
                tablaAfectada: data.tablaAfectada,
                registroId: data.registroId || null,
                datosAnteriores: data.datosAnteriores || null,
                datosNuevos: data.datosNuevos || null,
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null
            },
            select: {
                id: true,
                usuarioId: true,
                accion: true,
                tablaAfectada: true,
                registroId: true,
                datosAnteriores: true,
                datosNuevos: true,
                ipAddress: true,
                userAgent: true,
                fechaAccion: true
            }
        });
    }
    async update(id, data) {
        return await database_1.prisma.auditoria.update({
            where: { id },
            data,
            select: {
                id: true,
                usuarioId: true,
                accion: true,
                tablaAfectada: true,
                registroId: true,
                datosAnteriores: true,
                datosNuevos: true,
                ipAddress: true,
                userAgent: true,
                fechaAccion: true
            }
        });
    }
    async delete(id) {
        await database_1.prisma.auditoria.delete({
            where: { id }
        });
    }
}
exports.AuditoriaRepository = AuditoriaRepository;
exports.auditoriaRepository = new AuditoriaRepository();
