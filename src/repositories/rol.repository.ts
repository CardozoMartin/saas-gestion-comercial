import { prisma } from '@config/database';
import { IRol, ICreateRol, IUpdateRol, IAsignarRolUsuario } from '@types/rol.types';
import { Rol } from '@prisma/client';

export class RolRepository {

    constructor() { }

    //metodo para obtener todos los roles
    async findAll(): Promise<Rol[]> {
        const roles = await prisma.rol.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true,
            },
        });
        return roles;
    }
    //metodo para crear un nuevo rol
    async create(data: ICreateRol): Promise<Rol> {
        const rol = await prisma.rol.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
            },
        });
        return rol;
    }

    //metodo para actualizar un rol
    async update(id: number, data: IUpdateRol): Promise<Rol> {
        const rol = await prisma.rol.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
            },
        });
        return rol;
    }
    //metodo para asignar un rol a un usuario
    async asignarRolUsuario(data: IAsignarRolUsuario): Promise<void> {
        await prisma.usuarioRol.create({
            data: {
                usuarioId: data.usuarioId,
                rolId: data.rolId,
            },
        });
    }

    //metodo para eliminar un rol
    async delete(id: number): Promise<void> {
        await prisma.rol.delete({
            where: { id },
        });
    }
}

export const rolRepository = new RolRepository();