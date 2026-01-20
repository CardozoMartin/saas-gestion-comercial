"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoRepository = exports.ProductoRepository = void 0;
const database_1 = require("@config/database");
class ProductoRepository {
    async findAll(params) {
        // Valores por defecto
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;
        // Construir filtros dinámicos
        const where = {};
        if (params?.search) {
            where.OR = [
                { nombre: { contains: params.search, mode: "insensitive" } },
                { codigo: { contains: params.search, mode: "insensitive" } },
                { descripcion: { contains: params.search, mode: "insensitive" } },
            ];
        }
        if (params?.categoriaId) {
            where.categoriaId = params.categoriaId;
        }
        if (params?.activo !== undefined) {
            where.activo = params.activo;
        }
        // Construir ordenamiento
        const orderBy = {};
        if (params?.sortBy) {
            orderBy[params.sortBy] = params.sortOrder || "asc";
        }
        else {
            orderBy.fechaCreacion = "desc"; // Default
        }
        // Ejecutar queries en paralelo
        const [productos, total] = await Promise.all([
            database_1.prisma.producto.findMany({
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
                            nombre: true,
                        },
                    },
                    unidadMedida: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    stockActual: {
                        select: {
                            id: true,
                            cantidad: true,
                            fechaActualizacion: true,
                        },
                    },
                },
            }),
            database_1.prisma.producto.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            productos,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
    async findAllWithoutPagination() {
        return await database_1.prisma.producto.findMany({
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
                        nombre: true,
                    },
                },
                unidadMedida: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                stockActual: {
                    select: {
                        id: true,
                        cantidad: true,
                        fechaActualizacion: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return await database_1.prisma.producto.findUnique({
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
                fechaActualizacion: true,
            },
        });
    }
    //obtendremos los 10 productos con mas bajo stock
    async findLowStockProducts() {
        const result = await database_1.prisma.$queryRaw `
        SELECT 
            p.id,
            p.codigo,
            p.nombre,
            p.descripcion,
            p.categoria_id,
            p.precio_costo,
            p.precio_venta,
            p.unidad_medida_id,
            p.fraccionable,
            p.stock_minimo,
            p.activo,
            p.fecha_creacion,
            p.fecha_actualizacion,
            sa.cantidad as stock_cantidad
        FROM productos p
        INNER JOIN stock_actual sa ON p.id = sa.producto_id
        WHERE p.activo = 1
          AND sa.cantidad <= p.stock_minimo
        ORDER BY sa.cantidad ASC
        LIMIT 10
    `;
        return result;
    }
    async findByCodigo(codigo) {
        return await database_1.prisma.producto.findFirst({
            where: { codigo },
        });
    }
    async create(data) {
        return await database_1.prisma.producto.create({
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
                activo: true,
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
                fechaActualizacion: true,
            },
        });
    }
    async update(id, data) {
        return await database_1.prisma.producto.update({
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
                fechaActualizacion: true,
            },
        });
    }
    //metodo para actualizar unicamente el stock de un producto seleccionado
    async updateStock(id, cantidad) {
        return await database_1.prisma.producto.update({
            where: { id },
            data: {
                stockActual: {
                    update: {
                        cantidad: {
                            increment: cantidad
                        }
                    }
                }
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
                fechaActualizacion: true,
            },
        });
    }
    async delete(id) {
        return await database_1.prisma.producto.delete({
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
                fechaActualizacion: true,
            },
        });
    }
    // Métodos auxiliares solo para acceso a datos
    async createStockActual(productoId, cantidad) {
        return await database_1.prisma.stockActual.create({
            data: { productoId, cantidad },
        });
    }
    async updateStockActual(productoId, cantidad) {
        return await database_1.prisma.stockActual.update({
            where: { productoId },
            data: { cantidad },
        });
    }
    async getStockActual(productoId) {
        return await database_1.prisma.stockActual.findUnique({
            where: { productoId },
        });
    }
    //metodo para cambiar el estado de un producto
    async changeActivoStatus(id, activo) {
        return await database_1.prisma.producto.update({
            where: { id },
            data: { activo },
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
            },
        });
    }
}
exports.ProductoRepository = ProductoRepository;
exports.productoRepository = new ProductoRepository();
