import { prisma } from '@config/database';
import { IProducto, ICreateProducto, IUpdateProducto } from '@/types/producto.types';

export class ProductoRepository {

    async findAll(): Promise<IProducto[]> {
        return await prisma.producto.findMany({
            select: {
                id: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                categoriaId: true,
                precioCosto: true,
                precioVenta: true,
                unidadMedidaId: true,
                fraccionable: true,
                stockMinimo: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async findById(id: number): Promise<IProducto | null> {
        return await prisma.producto.findUnique({
            where: { id },
            select: {
                id: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                categoriaId: true,
                precioCosto: true,
                precioVenta: true,
                unidadMedidaId: true,
                fraccionable: true,
                stockMinimo: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async findByCodigo(codigo: string): Promise<IProducto | null> {
        return await prisma.producto.findFirst({
            where: { codigo }
        });
    }

    async create(data: ICreateProducto): Promise<IProducto> {
        return await prisma.producto.create({
            data: {
                codigo: data.codigo,
                nombre: data.nombre,
                descripcion: data.descripcion || null,
                categoriaId: data.categoriaId || null,
                precioCosto: data.precioCosto,
                precioVenta: data.precioVenta,
                unidadMedidaId: data.unidadMedidaId,
                fraccionable: data.fraccionable || false,
                stockMinimo: data.stockMinimo || 0,
                activo: true
            },
            select: {
                id: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                categoriaId: true,
                precioCosto: true,
                precioVenta: true,
                unidadMedidaId: true,
                fraccionable: true,
                stockMinimo: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateProducto>): Promise<IProducto> {
        return await prisma.producto.update({
            where: { id },
            data,
            select: {
                id: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                categoriaId: true,
                precioCosto: true,
                precioVenta: true,
                unidadMedidaId: true,
                fraccionable: true,
                stockMinimo: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    async delete(id: number): Promise<IProducto> {
        return await prisma.producto.delete({
            where: { id },
            select: {
                id: true,
                codigo: true,
                nombre: true,
                descripcion: true,
                categoriaId: true,
                precioCosto: true,
                precioVenta: true,
                unidadMedidaId: true,
                fraccionable: true,
                stockMinimo: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true
            }
        });
    }

    // Métodos auxiliares solo para acceso a datos
    async createStockActual(productoId: number, cantidad: number) {
        return await prisma.stockActual.create({
            data: { productoId, cantidad }
        });
    }

    async updateStockActual(productoId: number, cantidad: number) {
        return await prisma.stockActual.update({
            where: { productoId },
            data: { cantidad }
        });
    }

    async getStockActual(productoId: number) {
        return await prisma.stockActual.findUnique({
            where: { productoId }
        });
    }
}

export const productoRepository = new ProductoRepository();