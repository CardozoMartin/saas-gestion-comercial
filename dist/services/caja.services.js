"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cajaService = exports.CajaService = void 0;
const caja_repository_1 = require("@/repositories/caja.repository");
const database_1 = require("@config/database");
const decimal_js_1 = __importDefault(require("decimal.js"));
class CajaService {
    async abrirCaja(data, user) {
        // Validar que el usuario no tenga una caja abierta
        const cajaAbierta = await caja_repository_1.cajaRepository.findByUsuarioIdAndEstado(data.usuarioId, 'abierta');
        if (cajaAbierta) {
            throw new Error(`Ya tienes una caja abierta (ID: ${cajaAbierta.id}). Debes cerrarla antes de abrir una nueva.`);
        }
        // Buscar la última caja cerrada (de cualquier usuario)
        const ultimaCajaCerrada = await database_1.prisma.caja.findFirst({
            where: {
                estado: 'cerrada'
            },
            orderBy: {
                fechaCierre: 'desc'
            }
        });
        console.log('Última caja cerrada encontrada:', ultimaCajaCerrada);
        // Determinar el monto inicial
        let montoInicial;
        if (ultimaCajaCerrada?.fondoSiguienteCaja !== null && ultimaCajaCerrada?.fondoSiguienteCaja !== undefined) {
            const fondo = Number(ultimaCajaCerrada.fondoSiguienteCaja);
            // ✅ Solo aceptar si el fondo es positivo (>= 0), rechazar si es negativo
            if (fondo < 0) {
                throw new Error(`No se puede abrir la caja. El fondo de la caja anterior es negativo: $${fondo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}. Debe resolverse antes de continuar.`);
            }
            montoInicial = fondo;
            console.log(`✅ Usando fondo de caja anterior: $${montoInicial}`);
        }
        else {
            // Primera caja del sistema - iniciar en 0
            montoInicial = 0;
            console.log('✅ Primera caja del sistema - iniciando con $0');
        }
        // Crear la caja
        const caja = await caja_repository_1.cajaRepository.create({
            usuarioId: data.usuarioId,
            montoInicial,
            estado: 'abierta',
            observaciones: data.observaciones || null,
            cajaAnteriorId: ultimaCajaCerrada?.id || null
        });
        console.log(`✅ Caja abierta exitosamente con monto inicial: $${montoInicial}`);
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
        let totalEfectivo = new decimal_js_1.default(0);
        let totalTransferencias = new decimal_js_1.default(0);
        let totalVentas = new decimal_js_1.default(0);
        movimientos.forEach(mov => {
            const monto = new decimal_js_1.default(mov.monto);
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
        const montoEsperado = new decimal_js_1.default(caja.montoInicial).plus(totalEfectivo);
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
