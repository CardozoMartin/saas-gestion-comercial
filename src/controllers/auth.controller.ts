import { Request, Response } from "express";
import { authService } from "../services/auth.services";


export class AuthController {

    // Controlador para login de usuario
    async loginUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            // El servicio maneja toda la lógica: validación, comparación de contraseña y generación de token
            const resultado = await authService.serviceLoginUsuario(email, password);

            return res.status(200).json(resultado);
        } catch (error) {
            const mensajeError = (error as Error).message;

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

export const authController = new AuthController();


