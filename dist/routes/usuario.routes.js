"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = require("@controllers/usuario.controller");
const auth_controller_1 = require("@controllers/auth.controller");
const loginDataHandler_1 = require("@/middlewares/loginDataHandler");
const router = (0, express_1.Router)();
// Rutas de Usuario
// Patrón RESTful estándar
router.get('/', loginDataHandler_1.loginDataHandler, usuario_controller_1.usuarioController.getAll.bind(usuario_controller_1.usuarioController));
router.get('/:id', loginDataHandler_1.loginDataHandler, usuario_controller_1.usuarioController.getById.bind(usuario_controller_1.usuarioController));
router.post('/', loginDataHandler_1.loginDataHandler, usuario_controller_1.usuarioController.create.bind(usuario_controller_1.usuarioController));
router.put('/:id', loginDataHandler_1.loginDataHandler, usuario_controller_1.usuarioController.update.bind(usuario_controller_1.usuarioController));
router.delete('/:id', loginDataHandler_1.loginDataHandler, usuario_controller_1.usuarioController.delete.bind(usuario_controller_1.usuarioController));
// Ruta especial para login
router.post('/auth/login', auth_controller_1.authController.loginUsuario.bind(auth_controller_1.authController));
exports.default = router;
