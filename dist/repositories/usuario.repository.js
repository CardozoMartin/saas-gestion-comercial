"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioRepository = exports.UsuarioRepository = void 0;
const database_1 = require("@config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsuarioRepository {
    async findAll() {
        const usuarios = await database_1.prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
        return usuarios;
    }
    async findById(id) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
        return usuario;
    }
    async findByEmail(email) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { email },
        });
        return usuario;
    }
    async create(data) {
        // Hash de contraseña
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const usuario = await database_1.prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: passwordHash,
                telefono: data.telefono,
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
        return usuario;
    }
    async update(id, data) {
        const usuario = await database_1.prisma.usuario.update({
            where: { id },
            data: {
                ...(data.nombre && { nombre: data.nombre }),
                ...(data.apellido && { apellido: data.apellido }),
                ...(data.telefono !== undefined && { telefono: data.telefono }),
                ...(data.activo !== undefined && { activo: data.activo }),
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
        return usuario;
    }
    async delete(id) {
        await database_1.prisma.usuario.update({
            where: { id },
            data: { activo: false },
        });
    }
    async emailExists(email) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { email },
        });
        return !!usuario;
    }
    //vamos a crear un metodo para buscar por email y traer la contraseña hasheada
    async findByEmailWithPassword(email) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { email },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                roles: {
                    select: {
                        rol: {
                            select: {
                                id: true,
                                nombre: true,
                                descripcion: true,
                            },
                        },
                    },
                },
                password: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
        return usuario;
    }
}
exports.UsuarioRepository = UsuarioRepository;
// Exportar instancia única (singleton)
exports.usuarioRepository = new UsuarioRepository();
