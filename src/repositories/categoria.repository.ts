import { prisma } from '@config/database';
import { ICategoria, ICreateCategoria, IUpdateCategoria } from '@/types/categoria.types';

export class CategoriaRepository {

    async findAll(): Promise<ICategoria[]> {
        return await prisma.categoria.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }

    async findById(id: number): Promise<ICategoria | null> {
        return await prisma.categoria.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }

    async findByNombre(nombre: string): Promise<ICategoria | null> {
        return await prisma.categoria.findFirst({
            where: { nombre }
        });
    }

    async create(data: ICreateCategoria): Promise<ICategoria> {
        return await prisma.categoria.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion || null
            },
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCategoria>): Promise<ICategoria> {
        return await prisma.categoria.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.categoria.delete({
            where: { id }
        });
    }
}

export const categoriaRepository = new CategoriaRepository();
