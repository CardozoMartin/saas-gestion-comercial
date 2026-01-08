import { prisma } from '@config/database';
import { ICreateUsuario, IUpdateUsuario, IUsuario } from '@types/usuario.types';
import { Usuario } from '@prisma/client';
import bcrypt from 'bcryptjs';


export class UsuarioRepository {
 
  async findAll(): Promise<IUsuario[]> {
    const usuarios = await prisma.usuario.findMany({
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

  async findById(id: string): Promise<IUsuario | null> {
    const usuario = await prisma.usuario.findUnique({
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

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });
    return usuario;
  }

  async create(data: ICreateUsuario): Promise<IUsuario> {
    // Hash de contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    const usuario = await prisma.usuario.create({
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

  async update(id: string, data: IUpdateUsuario): Promise<IUsuario> {
    const usuario = await prisma.usuario.update({
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

  async delete(id: string): Promise<void> {
    await prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });
    return !!usuario;
  }
}

// Exportar instancia única (singleton)
export const usuarioRepository = new UsuarioRepository();
