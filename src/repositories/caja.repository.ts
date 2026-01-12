import { prisma } from '@config/database';
import { ICaja, ICreateCaja, IUpdateCaja, ICajaMovimiento, ICreateCajaMovimiento, IUpdateCajaMovimiento } from '@/types/caja.types';

export class CajaRepository {

    async findAll(): Promise<ICaja[]> {
        return await prisma.caja.findMany({
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async findById(id: number): Promise<ICaja | null> {
        return await prisma.caja.findUnique({
            where: { id },
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async findByUsuarioIdAndEstado(usuarioId: number, estado: string): Promise<ICaja | null> {
        return await prisma.caja.findFirst({
            where: { usuarioId, estado },
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async create(data: ICreateCaja): Promise<ICaja> {
        return await prisma.caja.create({
            data: {
                usuarioId: data.usuarioId,
                montoInicial: data.montoInicial,
                estado: data.estado || 'abierta',
                observaciones: data.observaciones || null
            },
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCaja>): Promise<ICaja> {
        return await prisma.caja.update({
            where: { id },
            data,
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.caja.delete({
            where: { id }
        });
    }
}

export class CajaMovimientoRepository {

    async findAll(): Promise<ICajaMovimiento[]> {
        return await prisma.cajaMovimiento.findMany({
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async findById(id: number): Promise<ICajaMovimiento | null> {
        return await prisma.cajaMovimiento.findUnique({
            where: { id },
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async findByCajaId(cajaId: number): Promise<ICajaMovimiento[]> {
        return await prisma.cajaMovimiento.findMany({
            where: { cajaId },
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async create(data: ICreateCajaMovimiento): Promise<ICajaMovimiento> {
        return await prisma.cajaMovimiento.create({
            data: {
                cajaId: data.cajaId,
                pagoId: data.pagoId || null,
                tipoMovimiento: data.tipoMovimiento,
                medioPagoId: data.medioPagoId,
                monto: data.monto,
                descripcion: data.descripcion || null
            },
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCajaMovimiento>): Promise<ICajaMovimiento> {
        return await prisma.cajaMovimiento.update({
            where: { id },
            data,
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.cajaMovimiento.delete({
            where: { id }
        });
    }
}

export const cajaRepository = new CajaRepository();
export const cajaMovimientoRepository = new CajaMovimientoRepository();
