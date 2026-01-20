"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controller_1 = require("@controllers/rol.controller");
const loginDataHandler_1 = require("@/middlewares/loginDataHandler");
const router = (0, express_1.Router)();
//Get
router.get('/', loginDataHandler_1.loginDataHandler, rol_controller_1.rolController.getAllRoles.bind(rol_controller_1.rolController));
//Post
router.post('/', loginDataHandler_1.loginDataHandler, rol_controller_1.rolController.createRol.bind(rol_controller_1.rolController));
//Put
router.put('/:id', loginDataHandler_1.loginDataHandler, rol_controller_1.rolController.updateRol.bind(rol_controller_1.rolController));
//Delete
router.delete('/:id', loginDataHandler_1.loginDataHandler, rol_controller_1.rolController.deleteRol.bind(rol_controller_1.rolController));
exports.default = router;
