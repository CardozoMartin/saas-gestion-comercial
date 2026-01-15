import { prisma } from '@config/database';
import { IProducto, ICreateProducto, IUpdateProducto } from '@/types/producto.types';

export class ProductoRepository {

   async findAll(params?: IProductoPagination): Promise<IProductoPaginatedResult> {
    // Valores por defecto
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    // Construir filtros dinámicos
    const where: any = {};

    if (params?.search) {
        where.OR = [
            { nombre: { contains: params.search, mode: 'insensitive' } },
            { codigo: { contains: params.search, mode: 'insensitive' } },
            { descripcion: { contains: params.search, mode: 'insensitive' } }
        ];
    }

    if (params?.categoriaId) {
        where.categoriaId = params.categoriaId;
    }

    if (params?.activo !== undefined) {
        where.activo = params.activo;
    }

    // Construir ordenamiento
    const orderBy: any = {};
    if (params?.sortBy) {
        orderBy[params.sortBy] = params.sortOrder || 'asc';
    } else {
        orderBy.fechaCreacion = 'desc'; // Default
    }

    // Ejecutar queries en paralelo
    const [productos, total] = await Promise.all([
        prisma.producto.findMany({
            where,
            skip,
            take: limit,
            orderBy,
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
                fechaActualizacion: true,
                categoria: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                unidadMedida: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                stockActual: {
                    select: {
                        id: true,
                        cantidad: true,
                        fechaActualizacion: true
                    }
                }
            }
        }),
        prisma.producto.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        productos,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}
async findAllWithoutPagination(): Promise<IProducto[]> {
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
            fechaActualizacion: true,
            categoria: {
                select: {
                    id: true,
                    nombre: true
                }
            },
            unidadMedida: {
                select: {
                    id: true,
                    nombre: true
                }
            },
            stockActual: {
                select: {
                    id: true,
                    cantidad: true,
                    fechaActualizacion: true
                }
            }
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