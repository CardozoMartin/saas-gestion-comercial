import { Request, Response } from 'express';
import { usuarioService } from '@services/usuario.service';
import {
    createUsuarioSchema,
    updateUsuarioSchema,
    loginSchema,
} from '@validators/usuario.validator';


export class UsuarioController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await usuarioService.getAllUsuarios();
            res.json({
                success: true,
                data: usuarios,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error del servidor',
            });
        }
    }


    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const usuario = await usuarioService.getUsuarioById(id);
            res.json({
                success: true,
                data: usuario,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error ? error.message : 'Usuario no encontrado',
            });
        }
    }


    async create(req: Request, res: Response): Promise<void> {
        try {
            // Validar datos con Zod
            const validatedData = createUsuarioSchema.parse(req.body);

            const usuario = await usuarioService.createUsuario(validatedData);
            res.status(201).json({
                success: true,
                data: usuario,
                message: 'Usuario creado exitosamente',
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('validación')) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: error instanceof Error ? error.message : 'Error al crear usuario',
                });
            }
        }
    }


    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            //validamos el id como numero
            if (isNaN(Number(id))) {
                throw new Error('El ID del usuario debe ser un número válido');
            }
            // Validar datos con Zod
            const validatedData = updateUsuarioSchema.parse(req.body);

            const usuario = await usuarioService.updateUsuario(id, validatedData);
            res.json({
                success: true,
                data: usuario,
                message: 'Usuario actualizado exitosamente',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al actualizar usuario',
            });
        }
    }


    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await usuarioService.deleteUsuario(id);
            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente',
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al eliminar usuario',
            });
        }
    }


    async login(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = loginSchema.parse(req.body);
            const usuario = await usuarioService.loginUsuario(validatedData);
            res.json({
                success: true,
                data: usuario,
                message: 'Login exitoso',
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error en login',
            });
        }
    }
}

// Exportar instancia única (singleton)
export const usuarioController = new UsuarioController();
