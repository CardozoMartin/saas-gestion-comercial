import { prisma } from '@config/database';
import { IAuditoria, ICreateAuditoria, IUpdateAuditoria } from '@/types/auditoria.types';

export class AuditoriaRepository {

    async findAll(): Promise<IAuditoria[]> {
        return await prisma.auditoria.findMany({
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

    async findById(id: number): Promise<IAuditoria | null> {
        return await prisma.auditoria.findUnique({
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

    async findByUsuarioId(usuarioId: number): Promise<IAuditoria[]> {
        return await prisma.auditoria.findMany({
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

    async create(data: ICreateAuditoria): Promise<IAuditoria> {
        return await prisma.auditoria.create({
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

    async update(id: number, data: Partial<IUpdateAuditoria>): Promise<IAuditoria> {
        return await prisma.auditoria.update({
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

    async delete(id: number): Promise<void> {
        await prisma.auditoria.delete({
            where: { id }
        });
    }
}

export const auditoriaRepository = new AuditoriaRepository();
