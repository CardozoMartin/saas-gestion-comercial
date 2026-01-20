"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolController = exports.RolController = void 0;
const rol_services_1 = require("@/services/rol.services");
class RolController {
    //controlador para obtener todos los roles
    async getAllRoles(req, res) {
        try {
            const roles = await rol_services_1.rolService.serviceGetAllRoles();
            return res.json({
                success: true,
                data: roles,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }
    //controlador para crear un nuevo rol
    async createRol(req, res) {
        try {
            const rol = await rol_services_1.rolService.serviceCreateRol(req.body);
            return res.status(201).json({
                success: true,
                data: rol,
                message: 'Rol creado exitosamente',
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }
    //controlador para actualizar un rol
    async updateRol(req, res) {
        try {
            const { id } = req.params;
            const rol = await rol_services_1.rolService.serviceUpdateRol(Number(id), req.body);
            return res.json({
                success: true,
                data: rol,
                message: 'Rol actualizado exitosamente',
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }
    //controlador para eliminar un rol
    async deleteRol(req, res) {
        try {
            const { id } = req.params;
            const rol = await rol_services_1.rolService.serviceDeleteRol(Number(id));
            return res.json({
                success: true,
                message: 'Rol eliminado exitosamente',
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }
}
exports.RolController = RolController;
exports.rolController = new RolController();
