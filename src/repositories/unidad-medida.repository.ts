import { prisma } from '@config/database';
import { IUnidadMedida, ICreateUnidadMedida, IUpdateUnidadMedida } from '@/types/unidad-medida.types';

export class UnidadMedidaRepository {

    async findAll(): Promise<IUnidadMedida[]> {
        return await prisma.unidadMedida.findMany({
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }

    async findById(id: number): Promise<IUnidadMedida | null> {
        return await prisma.unidadMedida.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }

    async findByNombre(nombre: string): Promise<IUnidadMedida | null> {
        return await prisma.unidadMedida.findFirst({
            where: { nombre }
        });
    }

    async create(data: ICreateUnidadMedida): Promise<IUnidadMedida> {
        return await prisma.unidadMedida.create({
            data: {
                nombre: data.nombre,
                abreviatura: data.abreviatura
            },
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateUnidadMedida>): Promise<IUnidadMedida> {
        return await prisma.unidadMedida.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.unidadMedida.delete({
            where: { id }
        });
    }
}
