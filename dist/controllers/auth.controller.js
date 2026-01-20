"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_services_1 = require("../services/auth.services");
class AuthController {
    // Controlador para login de usuario
    async loginUsuario(req, res) {
        try {
            const { email, password } = req.body;
            // El servicio maneja toda la lógica: validación, comparación de contraseña y generación de token
            const resultado = await auth_services_1.authService.serviceLoginUsuario(email, password);
            return res.status(200).json(resultado);
        }
        catch (error) {
            const mensajeError = error.message;
            // Retornar 401 para credenciales inválidas, 400 para otros errores
            const statusCode = mensajeError.includes('contraseña') || mensajeError.includes('no está activo')
                ? 401
                : 400;
            return res.status(statusCode).json({
                message: mensajeError,
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
