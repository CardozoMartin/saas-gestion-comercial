"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_repository_1 = require("@/repositories/usuario.repository");
const env_1 = require("@/config/env");
class AuthService {
    constructor() { }
    // Servicio para login de usuario - Maneja toda la lógica de autenticación
    async serviceLoginUsuario(email, password) {
        try {
            // 1. Validar que email y password no estén vacíos
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }
            // 2. Buscar usuario por email
            const usuarioConPassword = await usuario_repository_1.usuarioRepository.findByEmailWithPassword(email);
            if (!usuarioConPassword) {
                throw new Error('Email o contraseña incorrectos');
            }
            // 3. Validar que el usuario esté activo
            if (!usuarioConPassword.activo) {
                throw new Error('El usuario no está activo');
            }
            // 4. Comparar contraseña
            const passwordValida = await bcryptjs_1.default.compare(password, usuarioConPassword.password);
            if (!passwordValida) {
                throw new Error('Email o contraseña incorrectos');
            }
            // 5. Generar token
            const token = this.generarToken(usuarioConPassword.id, usuarioConPassword.email, usuarioConPassword.nombre, usuarioConPassword.rol);
            // 6. Retornar respuesta sin la contraseña
            const { password: _, ...usuarioSinPassword } = usuarioConPassword;
            return {
                message: 'Login exitoso',
                token,
                usuario: usuarioSinPassword,
            };
        }
        catch (error) {
            throw error;
        }
    }
    // Método privado para generar token JWT
    generarToken(usuarioId, email, nombre, rol) {
        const payload = {
            id: usuarioId,
            email: email,
            nombre: nombre,
            rol: rol,
            iat: Math.floor(Date.now() / 1000), // timestamp
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
