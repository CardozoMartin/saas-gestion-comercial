import { usuarioRepository } from '@repositories/usuario.repository';
import { ICreateUsuario, ILoginUsuario, IUpdateUsuario, IUsuario } from '@types/usuario.types';
import { rolRepository } from '@/repositories/rol.repository';
import bcrypt from 'bcryptjs';


export class UsuarioService {

    constructor() { }

    async getAllUsuarios(): Promise<IUsuario[]> {
        try {
            const usuarios = await usuarioRepository.findAll();
            return usuarios;
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error}`);
        }
    }


    async getUsuarioById(id: string): Promise<IUsuario> {
        try {
            const usuario = await usuarioRepository.findById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            return usuario;
        } catch (error) {
            throw error;
        }
    }


    async createUsuario(data: ICreateUsuario): Promise<IUsuario> {
        try {
            // Validar si el email ya existe
            const emailExists = await usuarioRepository.emailExists(data.email);
            if (emailExists) {
                throw new Error('El email ya está registrado');
            }


            // Crear usuario
            const usuario = await usuarioRepository.create(data);

            //ahora asiganamos el rol por defecto de ' usuario nuevo 
            await rolRepository.asignarRolUsuario({
                usuarioId: usuario.id,
                rolId: 2,
            });

            return usuario;
        } catch (error) {
            throw error;
        }
    }


    async updateUsuario(id: string, data: IUpdateUsuario): Promise<IUsuario> {
        try {
            // Primero verificar que el usuario existe
            const usuarioExiste = await usuarioRepository.findById(id);
            if (!usuarioExiste) {
                throw new Error('Usuario no encontrado');
            }

            // Actualizar usuario
            const usuario = await usuarioRepository.update(id, data);
            return usuario;
        } catch (error) {
            throw error;
        }
    }


    async deleteUsuario(id: string): Promise<void> {
        try {
            const usuarioExiste = await usuarioRepository.findById(id);
            if (!usuarioExiste) {
                throw new Error('Usuario no encontrado');
            }
            await usuarioRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }


    async loginUsuario(data: ILoginUsuario): Promise<IUsuario> {
        try {
            const usuario = await usuarioRepository.findByEmail(data.email);
            if (!usuario) {
                throw new Error('Email o contraseña incorrectos');
            }

            // Comparar contraseña
            const passwordValida = await bcrypt.compare(data.password, usuario.password);
            if (!passwordValida) {
                throw new Error('Email o contraseña incorrectos');
            }

            // Retornar usuario sin contraseña
            const { password, ...usuarioSinPassword } = usuario;
            return usuarioSinPassword as IUsuario;
        } catch (error) {
            throw error;
        }
    }
}

// Exportar instancia única (singleton)
export const usuarioService = new UsuarioService();
