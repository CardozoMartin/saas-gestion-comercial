"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = exports.UsuarioController = void 0;
const usuario_service_1 = require("@services/usuario.service");
const usuario_validator_1 = require("@validators/usuario.validator");
class UsuarioController {
    async getAll(req, res) {
        try {
            const usuarios = await usuario_service_1.usuarioService.getAllUsuarios();
            res.json({
                success: true,
                data: usuarios,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id)))
                throw new Error('ID inválido');
            const usuario = await usuario_service_1.usuarioService.getUsuarioById(Number(id));
            res.json({
                success: true,
                data: usuario,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Usuario no encontrado',
            });
        }
    }
    async create(req, res) {
        try {
            // Validar datos con Zod
            const validatedData = usuario_validator_1.createUsuarioSchema.parse(req.body);
            const usuario = await usuario_service_1.usuarioService.createUsuario(validatedData);
            res.status(201).json({
                success: true,
                data: usuario,
                message: 'Usuario creado exitosamente',
            });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('validación')) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error al crear usuario',
                });
            }
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            //validamos el id como numero
            if (isNaN(Number(id))) {
                throw new Error('El ID del usuario debe ser un número válido');
            }
            // Validar datos con Zod
            const validatedData = usuario_validator_1.updateUsuarioSchema.parse(req.body);
            const usuario = await usuario_service_1.usuarioService.updateUsuario(Number(id), validatedData);
            res.json({
                success: true,
                data: usuario,
                message: 'Usuario actualizado exitosamente',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al actualizar usuario',
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id)))
                throw new Error('ID inválido');
            await usuario_service_1.usuarioService.deleteUsuario(Number(id));
            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al eliminar usuario',
            });
        }
    }
    async login(req, res) {
        try {
            const validatedData = usuario_validator_1.loginSchema.parse(req.body);
            const usuario = await usuario_service_1.usuarioService.loginUsuario(validatedData);
            res.json({
                success: true,
                data: usuario,
                message: 'Login exitoso',
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error en login',
            });
        }
    }
}
exports.UsuarioController = UsuarioController;
// Exportar instancia única (singleton)
exports.usuarioController = new UsuarioController();
