import { usuarioRepository } from '../repositories/usuario.repository';
import { ICreateUsuario, ILoginUsuario, IUpdateUsuario, IUsuario } from '../types/usuario.types';
import { rolRepository } from '../repositories/rol.repository';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';


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


    async getUsuarioById(id: number): Promise<IUsuario> {
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
    console.log('createUsuario data:', data);
    try {
      // Validar si el email ya existe
      const emailExists = await usuarioRepository.emailExists(data.email);
      if (emailExists) {
        throw new Error('El email ya está registrado');
      }

      // Validar que se proporcione un rolId
      if (!data.rolId) {
        throw new Error('El rolId es requerido');
      }

      // Iniciar transacción
      return await prisma.$transaction(async (tx) => {
        // 1. Crear usuario (esto retorna el usuario con su ID)
        const usuario = await usuarioRepository.create(data);

        console.log('Usuario creado con ID:', usuario.id);

        // 2. Asignar el rol al usuario usando el ID del usuario recién creado
        await rolRepository.asignarRolUsuario({
          usuarioId: usuario.id, // Usamos el ID del usuario creado
          rolId: data.rolId,      // Usamos el rolId que viene en el data
        });

        console.log('Rol asignado correctamente');

        return usuario;
      });
    } catch (error) {
      console.error('Error en createUsuario:', error);
      throw error;
    }
  }


    async updateUsuario(id: number, data: IUpdateUsuario): Promise<IUsuario> {
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


    async deleteUsuario(id: number): Promise<void> {
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
            const { email, password } = data;
            const usuario = await usuarioRepository.findByEmail(email);
            if (!usuario) {
                throw new Error('Email o contraseña incorrectos');
            }

            // Comparar contraseña
            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                throw new Error('Email o contraseña incorrectos');
            }

            // Retornar usuario sin contraseña
            const { password: _pwd, ...usuarioSinPassword } = usuario;
            return usuarioSinPassword as IUsuario;
        } catch (error) {
            throw error;
        }
    }
}

// Exportar instancia única (singleton)
export const usuarioService = new UsuarioService();
