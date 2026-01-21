"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Recaudado_controller_1 = require("@/controllers/Recaudado.controller");
const loginDataHandler_1 = require("@/middlewares/loginDataHandler");
const router = (0, express_1.Router)();
router.get('/pormes', loginDataHandler_1.loginDataHandler, Recaudado_controller_1.recaudadoController.getRecaudadoPorMes);
router.get('/porsemana', loginDataHandler_1.loginDataHandler, Recaudado_controller_1.recaudadoController.getRecaudadoPorSemana);
exports.default = router;
