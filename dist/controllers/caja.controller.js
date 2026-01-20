"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cajaController = void 0;
const caja_services_1 = require("../services/caja.services");
class CajaController {
    async abrirCaja(req, res) {
        try {
            const { usuarioId, observaciones } = req.body;
            const user = req.user;
            if (!usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId es requerido'
                });
            }
            const caja = await caja_services_1.cajaService.abrirCaja({
                usuarioId,
                observaciones
            }, user);
            return res.status(201).json({
                success: true,
                message: `Caja abierta con $${caja.montoInicial}`,
                data: caja
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async obtenerCajaAbierta(req, res) {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            if (isNaN(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId inválido'
                });
            }
            const caja = await caja_services_1.cajaService.obtenerCajaAbierta(usuarioId);
            if (!caja) {
                return res.status(404).json({
                    success: false,
                    message: 'No hay caja abierta para este usuario'
                });
            }
            return res.status(200).json({
                success: true,
                data: caja
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async cerrarCaja(req, res) {
        console.log(req.body);
        try {
            const cajaId = parseInt(req.params.id);
            const { montoFinalContado, montoRetirado, observaciones } = req.body;
            // ✅ Validaciones mejoradas
            if (isNaN(cajaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'cajaId inválido'
                });
            }
            if (montoFinalContado === undefined || montoFinalContado === null) {
                return res.status(400).json({
                    success: false,
                    message: 'montoFinalContado es requerido'
                });
            }
            if (montoFinalContado < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'montoFinalContado no puede ser negativo'
                });
            }
            if (montoRetirado !== undefined && montoRetirado < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'montoRetirado no puede ser negativo'
                });
            }
            const cajaCerrada = await caja_services_1.cajaService.cerrarCaja(cajaId, parseFloat(montoFinalContado), // ✅ Asegurar que sea número
            montoRetirado ? parseFloat(montoRetirado) : undefined, observaciones);
            return res.status(200).json({
                success: true,
                message: 'Caja cerrada exitosamente',
                data: cajaCerrada
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async obtenerResumenCaja(req, res) {
        try {
            const cajaId = parseInt(req.params.id);
            if (isNaN(cajaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'cajaId inválido'
                });
            }
            const resumen = await caja_services_1.cajaService.obtenerResumenCaja(cajaId);
            return res.status(200).json({
                success: true,
                data: resumen
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async listarCajasPorUsuario(req, res) {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            if (isNaN(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId inválido'
                });
            }
            const cajas = await caja_services_1.cajaService.listarCajasPorUsuario(usuarioId);
            return res.status(200).json({
                success: true,
                data: cajas
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async registrarMovimiento(req, res) {
        try {
            const cajaId = parseInt(req.params.id);
            const { tipoMovimiento, medioPagoId, monto, descripcion } = req.body;
            if (isNaN(cajaId) || !tipoMovimiento || !medioPagoId || monto === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos'
                });
            }
            if (!['ingreso', 'retiro'].includes(tipoMovimiento)) {
                return res.status(400).json({
                    success: false,
                    message: 'tipoMovimiento debe ser "ingreso" o "retiro"'
                });
            }
            const movimiento = await caja_services_1.cajaService.registrarMovimiento(cajaId, tipoMovimiento, medioPagoId, monto, descripcion);
            return res.status(201).json({
                success: true,
                message: 'Movimiento registrado exitosamente',
                data: movimiento
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async obtenerDetallesVentasCajaAbierta(req, res) {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            if (isNaN(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId inválido'
                });
            }
            const detallesVentas = await caja_services_1.cajaService.findDetallesVentasCajaAbierta(usuarioId);
            return res.status(200).json({
                success: true,
                data: detallesVentas
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getAllCajas(req, res) {
        try {
            const cajas = await caja_services_1.cajaService.getAllCajas();
            return res.status(200).json({
                success: true,
                data: cajas
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getCajaById(req, res) {
        try {
            const cajaId = parseInt(req.params.id);
            if (isNaN(cajaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'cajaId inválido'
                });
            }
            const caja = await caja_services_1.cajaService.getCajaById(cajaId);
            return res.status(200).json({
                success: true,
                data: caja
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.cajaController = new CajaController();
