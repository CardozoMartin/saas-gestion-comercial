import { cajaRepository, cajaMovimientoRepository } from "@/repositories/caja.repository";
import { pagoRepository } from "@/repositories/medio-pago.repository";
import { prisma } from '@config/database';
import { ICaja, ICreateCaja } from '@/types/caja.types';
import { Decimal } from '@prisma/client/runtime/library';

export class CajaService {

    /**
     * Abre una nueva caja para el usuario
     * Valida que no tenga otra caja abierta
     */
    async abrirCaja(data: ICreateCaja, user: any): Promise<ICaja> {
        // Validar que el usuario no tenga una caja abierta
        const cajaAbierta = await cajaRepository.findByUsuarioIdAndEstado(data.usuarioId, 'abierta');
        
        if (cajaAbierta) {
            throw new Error(`Ya tienes una caja abierta (ID: ${cajaAbierta.id}). Debes cerrarla antes de abrir una nueva.`);
        }

        // Validar monto inicial
        if (data.montoInicial < 0) {
            throw new Error('El monto inicial no puede ser negativo');
        }

        // Crear la caja
        const caja = await cajaRepository.create({
            usuarioId: data.usuarioId,
            montoInicial: data.montoInicial,
            estado: 'abierta',
            observaciones: data.observaciones || null
        });

        return caja;
    }

    /**
     * Obtiene la caja abierta del usuario
     */
    async obtenerCajaAbierta(usuarioId: number): Promise<ICaja | null> {
        return await cajaRepository.findByUsuarioIdAndEstado(usuarioId, 'abierta');
    }

    /**
     * Registra un movimiento de caja (venta, ingreso, retiro)
     */
    async registrarMovimiento(
        cajaId: number,
        tipoMovimiento: 'venta' | 'ingreso' | 'retiro',
        medioPagoId: number,
        monto: number,
        descripcion?: string,
        pagoId?: number
    ) {
        // Validar que la caja exista y esté abierta
        const caja = await cajaRepository.findById(cajaId);
        
        if (!caja) {
            throw new Error('Caja no encontrada');
        }

        if (caja.estado !== 'abierta') {
            throw new Error('La caja está cerrada. No se pueden registrar movimientos.');
        }

        // Crear el movimiento
        return await cajaMovimientoRepository.create({
            cajaId,
            pagoId: pagoId || null,
            tipoMovimiento,
            medioPagoId,
            monto,
            descripcion: descripcion || null
        });
    }

    /**
     * Cierra la caja calculando totales
     */
    async cerrarCaja(cajaId: number, montoFinalContado: number, observaciones?: string): Promise<ICaja> {
        // Validar que la caja exista
        const caja = await cajaRepository.findById(cajaId);
        
        if (!caja) {
            throw new Error('Caja no encontrada');
        }

        if (caja.estado === 'cerrada') {
            throw new Error('La caja ya está cerrada');
        }

        // Calcular totales desde los movimientos
        const movimientos = await cajaMovimientoRepository.findByCajaId(cajaId);
        
        let totalEfectivo = new Decimal(0);
        let totalTransferencias = new Decimal(0);
        let totalVentas = new Decimal(0);

        // Sumar movimientos por tipo de medio de pago
        movimientos.forEach(mov => {
            const monto = new Decimal(mov.monto);
            
            if (mov.tipoMovimiento === 'venta') {
                totalVentas = totalVentas.plus(monto);
                
                // Medio pago 1 = efectivo/contado, 2 = transferencia
                if (mov.medioPagoId === 1) {
                    totalEfectivo = totalEfectivo.plus(monto);
                } else if (mov.medioPagoId === 2) {
                    totalTransferencias = totalTransferencias.plus(monto);
                }
            } else if (mov.tipoMovimiento === 'ingreso') {
                if (mov.medioPagoId === 1) {
                    totalEfectivo = totalEfectivo.plus(monto);
                }
            } else if (mov.tipoMovimiento === 'retiro') {
                if (mov.medioPagoId === 1) {
                    totalEfectivo = totalEfectivo.minus(monto);
                }
            }
        });

        // Calcular diferencia (lo que debería haber - lo que hay físicamente)
        const montoEsperado = new Decimal(caja.montoInicial).plus(totalEfectivo);
        const diferencia = montoEsperado.minus(montoFinalContado);

        // Actualizar la caja
        const cajaActualizada = await cajaRepository.update(cajaId, {
            montoFinal: montoFinalContado,
            totalEfectivo: totalEfectivo.toNumber(),
            totalTransferencias: totalTransferencias.toNumber(),
            totalVentas: totalVentas.toNumber(),
            diferencia: diferencia.toNumber(),
            estado: 'cerrada',
            observaciones: observaciones || caja.observaciones
        });

        return cajaActualizada;
    }

    /**
     * Obtiene el resumen de una caja con sus movimientos
     */
    async obtenerResumenCaja(cajaId: number) {
        const caja = await cajaRepository.findById(cajaId);
        
        if (!caja) {
            throw new Error('Caja no encontrada');
        }

        const movimientos = await cajaMovimientoRepository.findByCajaId(cajaId);

        return {
            caja,
            movimientos,
            resumen: {
                montoInicial: caja.montoInicial,
                totalEfectivo: caja.totalEfectivo || 0,
                totalTransferencias: caja.totalTransferencias || 0,
                totalVentas: caja.totalVentas || 0,
                montoEsperadoEnCaja: Number(caja.montoInicial) + (caja.totalEfectivo || 0),
                diferencia: caja.diferencia || 0
            }
        };
    }

    /**
     * Lista todas las cajas de un usuario
     */
    async listarCajasPorUsuario(usuarioId: number): Promise<ICaja[]> {
        return await prisma.caja.findMany({
            where: { usuarioId },
            orderBy: { fechaApertura: 'desc' }
        });
    }
}

export const cajaService = new CajaService();
