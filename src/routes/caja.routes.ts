import { Router } from 'express';
import { cajaController } from '@/controllers/caja.controller';

const router = Router();

router.post('/abrir', cajaController.abrirCaja.bind(cajaController));
router.get('/abierta/:usuarioId', cajaController.obtenerCajaAbierta.bind(cajaController));
router.post('/:id/cerrar', cajaController.cerrarCaja.bind(cajaController));
router.get('/:id/resumen', cajaController.obtenerResumenCaja.bind(cajaController));
router.get('/usuario/:usuarioId', cajaController.listarCajasPorUsuario.bind(cajaController));
router.post('/:id/movimiento', cajaController.registrarMovimiento.bind(cajaController));

export default router;
