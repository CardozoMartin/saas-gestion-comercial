import { productoRepository } from "@/repositories/producto.repository";
import { stockRepository } from "@/repositories/stock.repository";
import { auditoriaRepository } from "@/repositories/auditoria.repository";
import { prisma } from '@config/database';
import { IProducto, ICreateProducto, IUpdateProducto,IProductoPaginatedResult } from '@/types/producto.types';

export class ProductoService {

    
    async getAllProductos(): Promise<IProducto[]> {
        
        return await productoRepository.findAll();
    }

    async getProductoById(id: string): Promise<IProductoPaginatedResult> {
        const idNumber = this.parseId(id);
        const producto = await productoRepository.findById(idNumber);
        
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        
        return producto;
    }

    
    async createProducto(data: ICreateProducto, user: any): Promise<IProducto> {
        // 1. Validaciones de negocio
        await this.validarCreacionProducto(data);

        // 2. Transacción compleja con lógica de negocio
        return await prisma.$transaction(async (tx) => {
            // Crear producto
            const producto = await productoRepository.create(data);

            // Crear stock inicial
            await productoRepository.createStockActual(
                producto.id, 
                data.cantidadInicial ?? 0
            );

            // Registrar movimiento si hay stock inicial
            if (data.cantidadInicial && data.cantidadInicial > 0) {
                await this.registrarMovimientoInicial(
                    producto.id, 
                    data.cantidadInicial, 
                    user
                );
            }

            // Auditoría
            await auditoriaRepository.create({
                usuarioId: user?.id || 1,
                accion: 'CREAR_PRODUCTO',
                tablaAfectada: 'productos',
                registroId: producto.id,
                datosNuevos: JSON.stringify(producto)
            });

            return producto;
        });
    }

    
    async updateProducto(id: string, data: IUpdateProducto, user: any): Promise<IProducto> {
        const idNumber = this.parseId(id);

        // 1. Validaciones de negocio
        await this.validarActualizacionProducto(idNumber, data);

        // 2. Transacción
        return await prisma.$transaction(async (tx) => {
            // Obtener datos previos
            const productoActual = await productoRepository.findById(idNumber);
            if (!productoActual) {
                throw new Error('Producto no encontrado');
            }

            // Actualizar producto
            const productoActualizado = await productoRepository.update(
                idNumber, 
                this.construirDatosActualizacion(data, productoActual)
            );

            // Actualizar stock si viene en la petición
            if (data.cantidadInicial !== undefined) {
                await this.actualizarStockProducto(idNumber, data.cantidadInicial);
            }

            // Auditoría
            await auditoriaRepository.create({
                usuarioId: user?.id || 1,
                accion: 'ACTUALIZAR_PRODUCTO',
                tablaAfectada: 'productos',
                registroId: idNumber,
                datosAnteriores: JSON.stringify(productoActual),
                datosNuevos: JSON.stringify(productoActualizado)
            });

            return productoActualizado;
        });
    }

    
    async deleteProducto(id: string, user: any): Promise<IProducto> {
        const idNumber = this.parseId(id);

        // Validación: no se puede eliminar si tiene movimientos
        await this.validarEliminacionProducto(idNumber);

        const producto = await productoRepository.delete(idNumber);

        // Auditoría
        await auditoriaRepository.create({
            usuarioId: user?.id || 1,
            accion: 'ELIMINAR_PRODUCTO',
            tablaAfectada: 'productos',
            registroId: idNumber,
            datosAnteriores: JSON.stringify(producto)
        });

        return producto;
    }

   
    
    private async validarCreacionProducto(data: ICreateProducto): Promise<void> {
        // Validar código único
        const existeCodigo = await productoRepository.findByCodigo(data.codigo);
        if (existeCodigo) {
            throw new Error(`Ya existe un producto con el código: ${data.codigo}`);
        }

        // Validar precios
        if (data.precioCosto < 0 || data.precioVenta < 0) {
            throw new Error('Los precios no pueden ser negativos');
        }

        if (data.precioVenta < data.precioCosto) {
            throw new Error('El precio de venta no puede ser menor al precio de costo');
        }

        // Validar stock inicial
        if (data.cantidadInicial && data.cantidadInicial < 0) {
            throw new Error('El stock inicial no puede ser negativo');
        }
    }

    private async validarActualizacionProducto(id: number, data: IUpdateProducto): Promise<void> {
        // Validar que el producto existe
        const existe = await productoRepository.findById(id);
        if (!existe) {
            throw new Error('Producto no encontrado');
        }

        // Si cambia el código, validar que no exista
        if (data.codigo && data.codigo !== existe.codigo) {
            const existeCodigo = await productoRepository.findByCodigo(data.codigo);
            if (existeCodigo) {
                throw new Error(`Ya existe otro producto con el código: ${data.codigo}`);
            }
        }

        // Validar precios si vienen en la actualización
        if (data.precioCosto !== undefined && data.precioCosto < 0) {
            throw new Error('El precio de costo no puede ser negativo');
        }
        if (data.precioVenta !== undefined && data.precioVenta < 0) {
            throw new Error('El precio de venta no puede ser negativo');
        }
    }

    private async validarEliminacionProducto(id: number): Promise<void> {
        // Verificar si tiene movimientos de stock
        const tieneMovimientos = await this.productoTieneMovimientos(id);
        if (tieneMovimientos) {
            throw new Error('No se puede eliminar un producto con movimientos de stock. Considere desactivarlo.');
        }
    }

    private async productoTieneMovimientos(productoId: number): Promise<boolean> {
        const count = await prisma.movimientoStock.count({
            where: { productoId }
        });
        return count > 0;
    }

    private async registrarMovimientoInicial(productoId: number, cantidad: number, user: any): Promise<void> {
        await prisma.movimientoStock.create({
            data: {
                productoId,
                tipoMovimiento: 'entrada',
                cantidad,
                motivo: 'Stock inicial al crear producto',
                usuarioId: user?.id || 1,
                referenciaId: null,
                referenciaTipo: 'stock_inicial'
            }
        });
    }

    private async actualizarStockProducto(productoId: number, nuevaCantidad: number): Promise<void> {
        const stockActual = await productoRepository.getStockActual(productoId);
        
        if (stockActual) {
            await productoRepository.updateStockActual(productoId, nuevaCantidad);
        } else {
            await productoRepository.createStockActual(productoId, nuevaCantidad);
        }
    }

    private construirDatosActualizacion(data: IUpdateProducto, actual: IProducto): Partial<IProducto> {
        return {
            codigo: data.codigo ?? actual.codigo,
            nombre: data.nombre ?? actual.nombre,
            descripcion: data.descripcion ?? actual.descripcion,
            categoriaId: data.categoriaId ?? actual.categoriaId,
            precioCosto: data.precioCosto ?? actual.precioCosto,
            precioVenta: data.precioVenta ?? actual.precioVenta,
            unidadMedidaId: data.unidadMedidaId ?? actual.unidadMedidaId,
            fraccionable: data.fraccionable ?? actual.fraccionable,
            stockMinimo: data.stockMinimo ?? actual.stockMinimo,
            activo: data.activo ?? actual.activo,
        };
    }

    private parseId(id: string): number {
        const idNumber = parseInt(id, 10);
        if (isNaN(idNumber)) {
            throw new Error('ID inválido');
        }
        return idNumber;
    }
}

export const productoService = new ProductoService();