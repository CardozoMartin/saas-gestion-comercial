import { prisma } from '@config/database';
import { ICliente, ICreateCliente, IUpdateCliente } from '@/types/cliente.types';

export class ClienteRepository {

    async findAll(): Promise<ICliente[]> {
        return await prisma.cliente.findMany({
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async findById(id: number): Promise<ICliente | null> {
        return await prisma.cliente.findUnique({
            where: { id },
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async findByNumeroDocumento(numeroDocumento: string): Promise<ICliente | null> {
        return await prisma.cliente.findFirst({
            where: { numeroDocumento }
        });
    }

    async create(data: ICreateCliente): Promise<ICliente> {
        return await prisma.cliente.create({
            data: {
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento,
                nombre: data.nombre,
                apellido: data.apellido || null,
                razonSocial: data.razonSocial || null,
                email: data.email || null,
                telefono: data.telefono || null,
                direccion: data.direccion || null,
                limiteCredito: data.limiteCredito || 0,
                activo: true
            },
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCliente>): Promise<ICliente> {
        return await prisma.cliente.update({
            where: { id },
            data,
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.cliente.delete({
            where: { id }
        });
    }
}

export const clienteRepository = new ClienteRepository();
