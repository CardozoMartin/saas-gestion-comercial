"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caja_controller_1 = require("@/controllers/caja.controller");
const router = (0, express_1.Router)();
//obtener todas las cajas y caja por id
router.get('/', caja_controller_1.cajaController.getAllCajas.bind(caja_controller_1.cajaController));
router.get('/:id', caja_controller_1.cajaController.getCajaById.bind(caja_controller_1.cajaController));
router.post('/abrir', caja_controller_1.cajaController.abrirCaja.bind(caja_controller_1.cajaController));
router.get('/abierta/:usuarioId', caja_controller_1.cajaController.obtenerCajaAbierta.bind(caja_controller_1.cajaController));
router.get('/cajas-abiertas-detalles/:usuarioId', caja_controller_1.cajaController.obtenerDetallesVentasCajaAbierta.bind(caja_controller_1.cajaController));
router.post('/:id/cerrar', caja_controller_1.cajaController.cerrarCaja.bind(caja_controller_1.cajaController));
router.get('/:id/resumen', caja_controller_1.cajaController.obtenerResumenCaja.bind(caja_controller_1.cajaController));
router.get('/usuario/:usuarioId', caja_controller_1.cajaController.listarCajasPorUsuario.bind(caja_controller_1.cajaController));
router.post('/:id/movimiento', caja_controller_1.cajaController.registrarMovimiento.bind(caja_controller_1.cajaController));
exports.default = router;
