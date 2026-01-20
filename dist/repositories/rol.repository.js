"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolRepository = exports.RolRepository = void 0;
const database_1 = require("@config/database");
class RolRepository {
    constructor() { }
    //metodo para obtener todos los roles
    async findAll() {
        const roles = await database_1.prisma.rol.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true,
            },
        });
        return roles;
    }
    //metodo para crear un nuevo rol
    async create(data) {
        const rol = await database_1.prisma.rol.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
            },
        });
        return rol;
    }
    //metodo para actualizar un rol
    async update(id, data) {
        const rol = await database_1.prisma.rol.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
            },
        });
        return rol;
    }
    //metodo para asignar un rol a un usuario
    async asignarRolUsuario(data) {
        await database_1.prisma.usuarioRol.create({
            data: {
                usuarioId: data.usuarioId,
                rolId: data.rolId,
            },
        });
    }
    //metodo para eliminar un rol
    async delete(id) {
        await database_1.prisma.rol.delete({
            where: { id },
        });
    }
}
exports.RolRepository = RolRepository;
exports.rolRepository = new RolRepository();
