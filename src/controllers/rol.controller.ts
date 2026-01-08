import { Request, Response } from 'express';
import { RolService, rolService } from '@/services/rol.services';



export class RolController {


    //controlador para obtener todos los roles
    async getAllRoles(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await rolService.serviceGetAllRoles();
            return res.json({
                success: true,
                data: roles,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }

    //controlador para crear un nuevo rol
    async createRol(req: Request, res: Response): Promise<Response> {
        try {
            const rol = await rolService.serviceCreateRol(req.body);
            return res.status(201).json({
                success: true,
                data: rol,
                message: 'Rol creado exitosamente',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }

    //controlador para actualizar un rol
    async updateRol(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const rol = await rolService.serviceUpdateRol(Number(id), req.body);
            return res.json({
                success: true,
                data: rol,
                message: 'Rol actualizado exitosamente',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }

    //controlador para eliminar un rol
    async deleteRol(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const rol = await rolService.serviceDeleteRol(Number(id));
            return res.json({
                success: true,
                message: 'Rol eliminado exitosamente',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }
}

export const rolController = new RolController();