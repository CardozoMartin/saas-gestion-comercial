"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caja_controller_1 = require("@/controllers/caja.controller");
const loginDataHandler_1 = require("@/middlewares/loginDataHandler");
const router = (0, express_1.Router)();
//obtener todas las cajas y caja por id
router.get('/', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.getAllCajas.bind(caja_controller_1.cajaController));
router.get('/:id', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.getCajaById.bind(caja_controller_1.cajaController));
router.post('/abrir', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.abrirCaja.bind(caja_controller_1.cajaController));
router.get('/abierta/:usuarioId', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.obtenerCajaAbierta.bind(caja_controller_1.cajaController));
router.get('/cajas-abiertas-detalles/:usuarioId', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.obtenerDetallesVentasCajaAbierta.bind(caja_controller_1.cajaController));
router.post('/:id/cerrar', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.cerrarCaja.bind(caja_controller_1.cajaController));
router.get('/:id/resumen', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.obtenerResumenCaja.bind(caja_controller_1.cajaController));
router.get('/usuario/:usuarioId', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.listarCajasPorUsuario.bind(caja_controller_1.cajaController));
router.post('/:id/movimiento', loginDataHandler_1.loginDataHandler, caja_controller_1.cajaController.registrarMovimiento.bind(caja_controller_1.cajaController));
exports.default = router;
