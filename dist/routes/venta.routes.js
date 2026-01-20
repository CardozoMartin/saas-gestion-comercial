"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venta_controller_1 = require("../controllers/venta.controller");
const loginDataHandler_1 = require("@/middlewares/loginDataHandler");
const router = (0, express_1.Router)();
router.post('/', loginDataHandler_1.loginDataHandler, venta_controller_1.ventaController.createVenta);
exports.default = router;
