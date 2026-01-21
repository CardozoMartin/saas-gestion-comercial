import { Router } from 'express';
import { cajaController } from '../controllers/caja.controller';
import { loginDataHandler } from '../middlewares/loginDataHandler';

const router = Router();

//obtener todas las cajas y caja por id
router.get('/',loginDataHandler, cajaController.getAllCajas.bind(cajaController));
router.get('/:id', loginDataHandler, cajaController.getCajaById.bind(cajaController));
router.post('/abrir', loginDataHandler, cajaController.abrirCaja.bind(cajaController));
router.get('/abierta/:usuarioId', loginDataHandler, cajaController.obtenerCajaAbierta.bind(cajaController));
router.get('/cajasabiertasdetalles/:usuarioId', loginDataHandler, cajaController.obtenerDetallesVentasCajaAbierta.bind(cajaController));
router.post('/:id/cerrar', loginDataHandler, cajaController.cerrarCaja.bind(cajaController));
router.get('/:id/resumen', loginDataHandler, cajaController.obtenerResumenCaja.bind(cajaController));
router.get('/usuario/:usuarioId', loginDataHandler, cajaController.listarCajasPorUsuario.bind(cajaController));
router.post('/:id/movimiento', loginDataHandler, cajaController.registrarMovimiento.bind(cajaController));

export default router;
