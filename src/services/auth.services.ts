import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { DtoUsuarioInterno, ILoginResponse, IUsuario } from '@/types/usuario.types'
import { usuarioRepository } from '@/repositories/usuario.repository'
import { env } from '@/config/env'


export class AuthService {

    constructor() { }

    // Servicio para login de usuario - Maneja toda la lógica de autenticación
    async serviceLoginUsuario(email: string, password: string): Promise<ILoginResponse> {
        try {
            // 1. Validar que email y password no estén vacíos
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }

            // 2. Buscar usuario por email
            const usuarioConPassword = await usuarioRepository.findByEmailWithPassword(email);
            if (!usuarioConPassword) {
                throw new Error('Email o contraseña incorrectos');
            }

            // 3. Validar que el usuario esté activo
            if (!usuarioConPassword.activo) {
                throw new Error('El usuario no está activo');
            }

            // 4. Comparar contraseña
            const passwordValida = await bcrypt.compare(password, usuarioConPassword.password);
            if (!passwordValida) {
                throw new Error('Email o contraseña incorrectos');
            }

            // 5. Generar token
            const token = this.generarToken(usuarioConPassword.id, usuarioConPassword.email);

            // 6. Retornar respuesta sin la contraseña
            const { password: _, ...usuarioSinPassword } = usuarioConPassword;

            return {
                message: 'Login exitoso',
                token,
                usuario: usuarioSinPassword as IUsuario,
            };
        } catch (error) {
            throw error;
        }
    }

    // Método privado para generar token JWT
    private generarToken(usuarioId: number, email: string): string {
        const payload = {
            id: usuarioId,
            email: email,
            iat: Math.floor(Date.now() / 1000), // timestamp
        };

        return jwt.sign(
            payload,
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );
    }
}

export const authService = new AuthService();