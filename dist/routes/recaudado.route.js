"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Recaudado_controller_1 = require("@/controllers/Recaudado.controller");
const router = (0, express_1.Router)();
router.get('/pormes', Recaudado_controller_1.recaudadoController.getRecaudadoPorMes);
router.get('/porsemana', Recaudado_controller_1.recaudadoController.getRecaudadoPorSemana);
exports.default = router;
