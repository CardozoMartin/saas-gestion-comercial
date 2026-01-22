import { prisma } from "../config/database";
import {
  IProducto,
  ICreateProducto,
  IUpdateProducto,
  IProductoPagination,
  IProductoPaginatedResult,
} from "../types/producto.types";

export class ProductoRepository {
  async findAll(
    params?: IProductoPagination,
  ): Promise<IProductoPaginatedResult> {
    // Valores por defecto
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    // Construir filtros dinámicos
    const where: any = {};

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
    const orderBy: any = {};
    if (params?.sortBy) {
      orderBy[params.sortBy] = params.sortOrder || "asc";
    } else {
      orderBy.fechaCreacion = "desc"; // Default
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
      prisma.producto.count({ where }),
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
        fechaActualizacion: true,
      },
    });
  }
  //funcion para obtener un producto por nombre o codigo
 async findByNameOrCode(nameOrCode: string): Promise<IProducto[]> {

  const searchTerm = nameOrCode.toLocaleLowerCase()
    return await prisma.producto.findMany({
      where: {
        OR: [
          { nombre: { contains: searchTerm } }, // Ya es case-insensitive en MySQL
          { codigo: { contains: searchTerm } },
        ],
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
        }
    });
}


  //obtendremos los 10 productos con mas bajo stock
  async findLowStockProducts(): Promise<any[]> {
    const result = await prisma.$queryRaw<any[]>`
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

  async findByCodigo(codigo: string): Promise<IProducto | null> {
    return await prisma.producto.findFirst({
      where: { codigo },
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
        fechaActualizacion: true,
      },
    });
  }

  //metodo para actualizar unicamente el stock de un producto seleccionado
  async updateStock(id: number, cantidad: number): Promise<IProducto> {
    return await prisma.producto.update({
      where: { id },
        data: {
            stockActual: {
                update: {
                    cantidad:{
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
        fechaActualizacion: true,
      },
    });
  }

  // Métodos auxiliares solo para acceso a datos
  async createStockActual(productoId: number, cantidad: number) {
    return await prisma.stockActual.create({
      data: { productoId, cantidad },
    });
  }

  async updateStockActual(productoId: number, cantidad: number) {
    return await prisma.stockActual.update({
      where: { productoId },
      data: { cantidad },
    });
  }

  async getStockActual(productoId: number) {
    return await prisma.stockActual.findUnique({
      where: { productoId },
    });
  }

  //metodo para cambiar el estado de un producto
  async changeActivoStatus(id: number, activo: boolean): Promise<IProducto> {
    return await prisma.producto.update({
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

export const productoRepository = new ProductoRepository();
