import { Router } from 'express';
import { cajaController } from '@/controllers/caja.controller';

const router = Router();

/**
 * @route   POST /api/cajas/abrir
 * @desc    Abrir una nueva caja
 * @access  Private
 */
router.post('/abrir', cajaController.abrirCaja.bind(cajaController));

/**
 * @route   GET /api/cajas/abierta/:usuarioId
 * @desc    Obtener la caja abierta de un usuario
 * @access  Private
 */
router.get('/abierta/:usuarioId', cajaController.obtenerCajaAbierta.bind(cajaController));

/**
 * @route   POST /api/cajas/:id/cerrar
 * @desc    Cerrar una caja
 * @access  Private
 */
router.post('/:id/cerrar', cajaController.cerrarCaja.bind(cajaController));

/**
 * @route   GET /api/cajas/:id/resumen
 * @desc    Obtener resumen completo de una caja
 * @access  Private
 */
router.get('/:id/resumen', cajaController.obtenerResumenCaja.bind(cajaController));

/**
 * @route   GET /api/cajas/usuario/:usuarioId
 * @desc    Listar todas las cajas de un usuario
 * @access  Private
 */
router.get('/usuario/:usuarioId', cajaController.listarCajasPorUsuario.bind(cajaController));

/**
 * @route   POST /api/cajas/:id/movimiento
 * @desc    Registrar ingreso o retiro manual
 * @access  Private
 */
router.post('/:id/movimiento', cajaController.registrarMovimiento.bind(cajaController));

export default router;
