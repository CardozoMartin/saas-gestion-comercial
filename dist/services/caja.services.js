"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cajaService = exports.CajaService = void 0;
const caja_repository_1 = require("@/repositories/caja.repository");
const database_1 = require("@config/database");
const library_1 = require("@prisma/client/runtime/library");
class CajaService {
    async abrirCaja(data, user) {
        // Validar que el usuario no tenga una caja abierta
        const cajaAbierta = await caja_repository_1.cajaRepository.findByUsuarioIdAndEstado(data.usuarioId, 'abierta');
        if (cajaAbierta) {
            throw new Error(`Ya tienes una caja abierta (ID: ${cajaAbierta.id}). Debes cerrarla antes de abrir una nueva.`);
        }
        // ✅ NUEVO: Buscar la última caja cerrada
        const ultimaCajaCerrada = await database_1.prisma.caja.findFirst({
            where: {
                usuarioId: data.usuarioId,
                estado: 'cerrada'
            },
            orderBy: {
                fechaCierre: 'desc'
            }
        });
        // ✅ NUEVO: Determinar el monto inicial
        let montoInicial = data.montoInicial;
        if (ultimaCajaCerrada?.fondoSiguienteCaja) {
            // Si hay fondo de la caja anterior, usarlo automáticamente
            montoInicial = Number(ultimaCajaCerrada.fondoSiguienteCaja);
        }
        else if (!montoInicial || montoInicial <= 0) {
            throw new Error('Debes proporcionar un monto inicial positivo para la primera caja o cuando no hay fondo anterior.');
        }
        // Validar monto inicial
        if (montoInicial < 0) {
            throw new Error('El monto inicial no puede ser negativo');
        }
        // Crear la caja
        const caja = await caja_repository_1.cajaRepository.create({
            usuarioId: data.usuarioId,
            montoInicial,
            estado: 'abierta',
            observaciones: data.observaciones || null,
            cajaAnteriorId: ultimaCajaCerrada?.id || null // ✅ NUEVO
        });
        return caja;
    }
    async cerrarCaja(cajaId, montoFinalContado, montoRetirado, observaciones) {
        const caja = await caja_repository_1.cajaRepository.findById(cajaId);
        if (!caja) {
            throw new Error('Caja no encontrada');
        }
        if (caja.estado === 'cerrada') {
            throw new Error('La caja ya está cerrada');
        }
        // Calcular totales desde los movimientos
        const movimientos = await caja_repository_1.cajaMovimientoRepository.findByCajaId(cajaId);
        let totalEfectivo = new library_1.Decimal(0);
        let totalTransferencias = new library_1.Decimal(0);
        let totalVentas = new library_1.Decimal(0);
        movimientos.forEach(mov => {
            const monto = new library_1.Decimal(mov.monto);
            if (mov.tipoMovimiento === 'venta') {
                totalVentas = totalVentas.plus(monto);
                if (mov.medioPagoId === 1) {
                    totalEfectivo = totalEfectivo.plus(monto);
                }
                else if (mov.medioPagoId === 2) {
                    totalTransferencias = totalTransferencias.plus(monto);
                }
            }
            else if (mov.tipoMovimiento === 'ingreso') {
                if (mov.medioPagoId === 1) {
                    totalEfectivo = totalEfectivo.plus(monto);
                }
            }
            else if (mov.tipoMovimiento === 'retiro') {
                if (mov.medioPagoId === 1) {
                    totalEfectivo = totalEfectivo.minus(monto);
                }
            }
        });
        // ✅ VALIDAR: montoRetirado no puede ser mayor que montoFinalContado
        const montoRetiradoFinal = montoRetirado ?? 0;
        if (montoRetiradoFinal > montoFinalContado) {
            throw new Error(`No puedes retirar más dinero del que hay en caja. ` +
                `En caja: $${montoFinalContado}, Intentas retirar: $${montoRetiradoFinal}`);
        }
        // ✅ CORRECTO: El fondo es lo que NO se retira
        const fondoSiguienteCaja = montoFinalContado - montoRetiradoFinal;
        // ✅ VALIDAR: El fondo no puede ser negativo (redundante pero por seguridad)
        if (fondoSiguienteCaja < 0) {
            throw new Error(`El fondo para la siguiente caja no puede ser negativo. ` +
                `Monto contado: $${montoFinalContado}, Retiro: $${montoRetiradoFinal}`);
        }
        // ✅ Calcular diferencia (lo que DEBERÍA haber - lo que hay FÍSICAMENTE)
        const montoEsperado = new library_1.Decimal(caja.montoInicial).plus(totalEfectivo);
        const diferencia = montoEsperado.minus(montoFinalContado);
        // ✅ Actualizar la caja con fecha de cierre
        const cajaActualizada = await caja_repository_1.cajaRepository.update(cajaId, {
            montoFinal: montoFinalContado,
            montoFinalContado: montoFinalContado,
            montoRetirado: montoRetiradoFinal,
            fondoSiguienteCaja: fondoSiguienteCaja,
            totalEfectivo: totalEfectivo.toNumber(),
            totalTransferencias: totalTransferencias.toNumber(),
            totalVentas: totalVentas.toNumber(),
            diferencia: diferencia.toNumber(),
            estado: 'cerrada',
            fechaCierre: new Date(), // ✅ IMPORTANTE: Registrar fecha de cierre
            observaciones: observaciones || caja.observaciones
        });
        return cajaActualizada;
    }
    async obtenerCajaAbierta(usuarioId) {
        return await caja_repository_1.cajaRepository.findByUsuarioIdAndEstado(usuarioId, 'abierta');
    }
    async registrarMovimiento(cajaId, tipoMovimiento, medioPagoId, monto, descripcion, pagoId) {
        // Validar que la caja exista y esté abierta
        const caja = await caja_repository_1.cajaRepository.findById(cajaId);
        if (!caja) {
            throw new Error('Caja no encontrada');
        }
        if (caja.estado !== 'abierta') {
            throw new Error('La caja está cerrada. No se pueden registrar movimientos.');
        }
        // Crear el movimiento
        return await caja_repository_1.cajaMovimientoRepository.create({
            cajaId,
            pagoId: pagoId || null,
            tipoMovimiento,
            medioPagoId,
            monto,
            descripcion: descripcion || null
        });
    }
    // ✅ NUEVO: Obtener información del fondo requerido para abrir caja
    async obtenerFondoRequerido(usuarioId) {
        const ultimaCajaCerrada = await database_1.prisma.caja.findFirst({
            where: {
                usuarioId,
                estado: 'cerrada'
            },
            orderBy: {
                fechaCierre: 'desc'
            },
            select: {
                id: true,
                fondoSiguienteCaja: true,
                fechaCierre: true
            }
        });
        if (!ultimaCajaCerrada || !ultimaCajaCerrada.fondoSiguienteCaja) {
            return {
                requiereFondo: false,
                montoRequerido: 0
            };
        }
        return {
            requiereFondo: true,
            montoRequerido: Number(ultimaCajaCerrada.fondoSiguienteCaja),
            ultimaCaja: ultimaCajaCerrada
        };
    }
    async obtenerResumenCaja(cajaId) {
        const caja = await caja_repository_1.cajaRepository.findById(cajaId);
        if (!caja) {
            throw new Error('Caja no encontrada');
        }
        const movimientos = await caja_repository_1.cajaMovimientoRepository.findByCajaId(cajaId);
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
    async listarCajasPorUsuario(usuarioId) {
        return await database_1.prisma.caja.findMany({
            where: { usuarioId },
            orderBy: { fechaApertura: 'desc' }
        });
    }
    //obtener todos los detalles de ventas de cajas abiertas de un usuario
    async findDetallesVentasCajaAbierta(usuarioId) {
        const boxOpenByUser = await caja_repository_1.cajaRepository.findResumenCajaAbierta(usuarioId);
        if (!boxOpenByUser) {
            throw new Error('No hay caja abierta para este usuario');
        }
        return boxOpenByUser;
    }
    //obtener todas las cajas 
    async getAllCajas() {
        return await caja_repository_1.cajaRepository.findAll();
    }
    //obtener una caja por id
    async getCajaById(cajaId) {
        return await caja_repository_1.cajaRepository.findById(cajaId);
    }
}
exports.CajaService = CajaService;
exports.cajaService = new CajaService();
