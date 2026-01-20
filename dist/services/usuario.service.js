"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioService = exports.UsuarioService = void 0;
const usuario_repository_1 = require("@repositories/usuario.repository");
const rol_repository_1 = require("@/repositories/rol.repository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsuarioService {
    constructor() { }
    async getAllUsuarios() {
        try {
            const usuarios = await usuario_repository_1.usuarioRepository.findAll();
            return usuarios;
        }
        catch (error) {
            throw new Error(`Error al obtener usuarios: ${error}`);
        }
    }
    async getUsuarioById(id) {
        try {
            const usuario = await usuario_repository_1.usuarioRepository.findById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            return usuario;
        }
        catch (error) {
            throw error;
        }
    }
    async createUsuario(data) {
        try {
            // Validar si el email ya existe
            const emailExists = await usuario_repository_1.usuarioRepository.emailExists(data.email);
            if (emailExists) {
                throw new Error('El email ya está registrado');
            }
            // Crear usuario
            const usuario = await usuario_repository_1.usuarioRepository.create(data);
            //ahora asiganamos el rol por defecto de ' usuario nuevo 
            await rol_repository_1.rolRepository.asignarRolUsuario({
                usuarioId: usuario.id,
                rolId: 2,
            });
            return usuario;
        }
        catch (error) {
            throw error;
        }
    }
    async updateUsuario(id, data) {
        try {
            // Primero verificar que el usuario existe
            const usuarioExiste = await usuario_repository_1.usuarioRepository.findById(id);
            if (!usuarioExiste) {
                throw new Error('Usuario no encontrado');
            }
            // Actualizar usuario
            const usuario = await usuario_repository_1.usuarioRepository.update(id, data);
            return usuario;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteUsuario(id) {
        try {
            const usuarioExiste = await usuario_repository_1.usuarioRepository.findById(id);
            if (!usuarioExiste) {
                throw new Error('Usuario no encontrado');
            }
            await usuario_repository_1.usuarioRepository.delete(id);
        }
        catch (error) {
            throw error;
        }
    }
    async loginUsuario(email, password) {
        try {
            const usuario = await usuario_repository_1.usuarioRepository.findByEmail(email);
            if (!usuario) {
                throw new Error('Email o contraseña incorrectos');
            }
            // Comparar contraseña
            const passwordValida = await bcryptjs_1.default.compare(password, usuario.password);
            if (!passwordValida) {
                throw new Error('Email o contraseña incorrectos');
            }
            // Retornar usuario sin contraseña
            const { password, ...usuarioSinPassword } = usuario;
            return usuarioSinPassword;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UsuarioService = UsuarioService;
// Exportar instancia única (singleton)
exports.usuarioService = new UsuarioService();
