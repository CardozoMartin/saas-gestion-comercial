import { Request, Response } from "express";
import { cajaService } from "../services/caja.services";

class CajaController {


    async abrirCaja(req: Request, res: Response): Promise<Response> {
        try {
            const { usuarioId, observaciones } = req.body;
            const user = (req as any).user;

            if (!usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId es requerido'
                });
            }

            const caja = await cajaService.abrirCaja({
                usuarioId,
                observaciones
            }, user);

            return res.status(201).json({
                success: true,
                message: `Caja abierta con $${caja.montoInicial}`,
                data: caja
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async obtenerCajaAbierta(req: Request, res: Response): Promise<Response> {
        try {
            const usuarioId = parseInt(req.params.usuarioId);

            if (isNaN(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId inválido'
                });
            }

            const caja = await cajaService.obtenerCajaAbierta(usuarioId);

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
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async cerrarCaja(req: Request, res: Response): Promise<Response> {
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

            const cajaCerrada = await cajaService.cerrarCaja(
                cajaId,
                parseFloat(montoFinalContado), // ✅ Asegurar que sea número
                montoRetirado ? parseFloat(montoRetirado) : undefined,
                observaciones
            );

            return res.status(200).json({
                success: true,
                message: 'Caja cerrada exitosamente',
                data: cajaCerrada
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async obtenerResumenCaja(req: Request, res: Response): Promise<Response> {
        try {
            const cajaId = parseInt(req.params.id);

            if (isNaN(cajaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'cajaId inválido'
                });
            }

            const resumen = await cajaService.obtenerResumenCaja(cajaId);

            return res.status(200).json({
                success: true,
                data: resumen
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async listarCajasPorUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const usuarioId = parseInt(req.params.usuarioId);

            if (isNaN(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId inválido'
                });
            }

            const cajas = await cajaService.listarCajasPorUsuario(usuarioId);

            return res.status(200).json({
                success: true,
                data: cajas
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async registrarMovimiento(req: Request, res: Response): Promise<Response> {
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

            const movimiento = await cajaService.registrarMovimiento(
                cajaId,
                tipoMovimiento,
                medioPagoId,
                monto,
                descripcion
            );

            return res.status(201).json({
                success: true,
                message: 'Movimiento registrado exitosamente',
                data: movimiento
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async obtenerDetallesVentasCajaAbierta(req: Request, res: Response): Promise<Response> {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            if (isNaN(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId inválido'
                });
            }
            const detallesVentas = await cajaService.findDetallesVentasCajaAbierta(usuarioId);
            return res.status(200).json({
                success: true,
                data: detallesVentas
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getAllCajas(req: Request, res: Response): Promise<Response> {
        try {
            const cajas = await cajaService.getAllCajas();
            return res.status(200).json({
                success: true,
                data: cajas
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCajaById(req: Request, res: Response): Promise<Response> {
        try {
            const cajaId = parseInt(req.params.id);
            if (isNaN(cajaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'cajaId inválido'
                });
            }
            const caja = await cajaService.getCajaById(cajaId);
            return res.status(200).json({
                success: true,
                data: caja
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

export const cajaController = new CajaController();
