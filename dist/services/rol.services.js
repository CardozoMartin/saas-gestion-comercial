"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolService = exports.RolService = void 0;
const rol_repository_1 = require("@/repositories/rol.repository");
class RolService {
    constructor() { }
    //servicio para obtener todos los roles
    async serviceGetAllRoles() {
        try {
            const roles = await rol_repository_1.rolRepository.findAll();
            return roles;
        }
        catch (error) {
            throw new Error(`Error al obtener roles: ${error}`);
        }
    }
    //servicio para crear un nuevo rol
    async serviceCreateRol(data) {
        try {
            const rol = await rol_repository_1.rolRepository.create(data);
            return rol;
        }
        catch (error) {
            throw new Error(`Error al crear rol: ${error}`);
        }
    }
    //servicio para actualizar un rol
    async serviceUpdateRol(id, data) {
        try {
            const rol = await rol_repository_1.rolRepository.update(id, data);
            return rol;
        }
        catch (error) {
            throw new Error(`Error al actualizar rol: ${error}`);
        }
    }
    //servicio para eliminar un rol
    async serviceDeleteRol(id) {
        try {
            await rol_repository_1.rolRepository.delete(id);
        }
        catch (error) {
            throw new Error(`Error al eliminar rol: ${error}`);
        }
    }
}
exports.RolService = RolService;
exports.rolService = new RolService();
