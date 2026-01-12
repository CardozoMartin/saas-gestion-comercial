import { Request, Response } from "express";
import { cajaService } from "../services/caja.services";

class CajaController {

    /**
     * Abre una nueva caja
     * POST /api/cajas/abrir
     * Body: { usuarioId, montoInicial, observaciones? }
     */
    async abrirCaja(req: Request, res: Response): Promise<Response> {
        try {
            const { usuarioId, montoInicial, observaciones } = req.body;
            const user = (req as any).user;

            if (!usuarioId || montoInicial === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId y montoInicial son requeridos'
                });
            }

            const caja = await cajaService.abrirCaja({
                usuarioId,
                montoInicial,
                observaciones
            }, user);

            return res.status(201).json({
                success: true,
                message: 'Caja abierta exitosamente',
                data: caja
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Obtiene la caja abierta del usuario
     * GET /api/cajas/abierta/:usuarioId
     */
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

    /**
     * Cierra la caja actual
     * POST /api/cajas/:id/cerrar
     * Body: { montoFinalContado, observaciones? }
     */
    async cerrarCaja(req: Request, res: Response): Promise<Response> {
        try {
            const cajaId = parseInt(req.params.id);
            const { montoFinalContado, observaciones } = req.body;

            if (isNaN(cajaId) || montoFinalContado === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'cajaId y montoFinalContado son requeridos'
                });
            }

            const cajaCerrada = await cajaService.cerrarCaja(
                cajaId,
                montoFinalContado,
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

    /**
     * Obtiene el resumen completo de una caja
     * GET /api/cajas/:id/resumen
     */
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

    /**
     * Lista todas las cajas de un usuario
     * GET /api/cajas/usuario/:usuarioId
     */
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

    /**
     * Registra un ingreso o retiro manual de dinero
     * POST /api/cajas/:id/movimiento
     * Body: { tipoMovimiento: 'ingreso' | 'retiro', medioPagoId, monto, descripcion }
     */
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
}

export const cajaController = new CajaController();
