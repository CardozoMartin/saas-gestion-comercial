"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_controller_1 = require("@/controllers/cliente.controller");
const loginDataHandler_1 = require("@/middlewares/loginDataHandler");
const router = (0, express_1.Router)();
// RUTAS CRUD DE CLIENTES
router.get('/', cliente_controller_1.clienteController.getAllClientes);
router.get('/clientescondeudas', cliente_controller_1.clienteController.getClientesConMayorDeuda);
router.get('/:id', cliente_controller_1.clienteController.getClienteById);
router.post('/', cliente_controller_1.clienteController.createCliente);
router.patch('/:id/activo', loginDataHandler_1.loginDataHandler, cliente_controller_1.clienteController.toggleClienteActivo);
router.put('/:id', cliente_controller_1.clienteController.updateCliente);
router.delete('/:id', cliente_controller_1.clienteController.deleteCliente);
// RUTAS DE CUENTA CORRIENTE
router.get('/:id/cuenta-corriente', cliente_controller_1.clienteController.getResumenCuentaCorriente);
router.get('/:id/ventas/:ventaId', cliente_controller_1.clienteController.getDetalleVenta);
// RUTAS DE PAGOS
router.post('/:id/pagar', loginDataHandler_1.loginDataHandler, cliente_controller_1.clienteController.pagarCuentaCorriente);
router.post('/:id/pagar-ventas', loginDataHandler_1.loginDataHandler, cliente_controller_1.clienteController.pagarVentasEspecificas);
exports.default = router;
