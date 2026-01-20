"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoService = exports.ProductoService = void 0;
const producto_repository_1 = require("@/repositories/producto.repository");
const auditoria_repository_1 = require("@/repositories/auditoria.repository");
const database_1 = require("@config/database");
class ProductoService {
    async getAllProductos(params) {
        return await producto_repository_1.productoRepository.findAll(params);
    }
    async getProductosSinPaginacion() {
        const productos = await producto_repository_1.productoRepository.findAllWithoutPagination();
        //producto DTO
        const productoDTOs = productos.map((producto) => ({
            id: producto.id,
            codigo: producto.codigo,
            nombre: producto.nombre,
            precioVenta: producto.precioVenta,
            stockActual: producto.stockActual ? producto.stockActual.cantidad : 0,
            categoriaNombre: producto.categoria ? producto.categoria.nombre : undefined,
            unidadMedidaNombre: producto.unidadMedida ? producto.unidadMedida.nombre : undefined,
            unidadMedidaId: producto.unidadMedidaId
        }));
        return productoDTOs;
    }
    async getProductoById(id) {
        const idNumber = this.parseId(id);
        //vamos agregar paginacion
        const producto = await producto_repository_1.productoRepository.findById(idNumber);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return producto;
    }
    async createProducto(data, user) {
        // 1. Validaciones de negocio
        await this.validarCreacionProducto(data);
        //convertimos las cantidades kg, litro y cm a gramos, mililitros y milimetros
        //verificamos que unidad llega para el nuevo producto
        if (data.unidadMedidaId === 2) { //kg a gramos
            data.cantidadInicial = data.cantidadInicial ? data.cantidadInicial * 1000 : 0;
        }
        else if (data.unidadMedidaId === 3) { //litro a mililitros
            data.cantidadInicial = data.cantidadInicial ? data.cantidadInicial * 1000 : 0;
        }
        else if (data.unidadMedidaId === 4) { //cm a milimetros
            data.cantidadInicial = data.cantidadInicial ? data.cantidadInicial * 10 : 0;
        }
        // 2. Transacción compleja con lógica de negocio
        return await database_1.prisma.$transaction(async (tx) => {
            // Crear producto
            const producto = await producto_repository_1.productoRepository.create(data);
            // Crear stock inicial
            await producto_repository_1.productoRepository.createStockActual(producto.id, data.cantidadInicial ?? 0);
            // Registrar movimiento si hay stock inicial
            if (data.cantidadInicial && data.cantidadInicial > 0) {
                await this.registrarMovimientoInicial(producto.id, data.cantidadInicial, user);
            }
            // Auditoría
            await auditoria_repository_1.auditoriaRepository.create({
                usuarioId: user?.id || 1,
                accion: 'CREAR_PRODUCTO',
                tablaAfectada: 'productos',
                registroId: producto.id,
                datosNuevos: JSON.stringify(producto)
            });
            return producto;
        });
    }
    async updateProducto(id, data, user) {
        const idNumber = this.parseId(id);
        // 1. Validaciones de negocio
        await this.validarActualizacionProducto(idNumber, data);
        // 2. Transacción
        return await database_1.prisma.$transaction(async (tx) => {
            // Obtener datos previos
            const productoActual = await producto_repository_1.productoRepository.findById(idNumber);
            if (!productoActual) {
                throw new Error('Producto no encontrado');
            }
            // Actualizar producto
            const productoActualizado = await producto_repository_1.productoRepository.update(idNumber, this.construirDatosActualizacion(data, productoActual));
            // Actualizar stock si viene en la petición
            if (data.cantidadInicial !== undefined) {
                await this.actualizarStockProducto(idNumber, data.cantidadInicial);
            }
            // Auditoría
            await auditoria_repository_1.auditoriaRepository.create({
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
    async deleteProducto(id, user) {
        const idNumber = this.parseId(id);
        // Validación: no se puede eliminar si tiene movimientos
        await this.validarEliminacionProducto(idNumber);
        const producto = await producto_repository_1.productoRepository.delete(idNumber);
        // Auditoría
        await auditoria_repository_1.auditoriaRepository.create({
            usuarioId: user?.id || 1,
            accion: 'ELIMINAR_PRODUCTO',
            tablaAfectada: 'productos',
            registroId: idNumber,
            datosAnteriores: JSON.stringify(producto)
        });
        return producto;
    }
    async changeProductoStatus(id) {
        const idNumber = this.parseId(id);
        const productoActual = await producto_repository_1.productoRepository.findById(idNumber);
        if (!productoActual) {
            throw new Error('Producto no encontrado');
        }
        const activo = !productoActual.activo;
        const productoActualizado = await producto_repository_1.productoRepository.update(idNumber, { activo });
        // Auditoría
        await auditoria_repository_1.auditoriaRepository.create({
            usuarioId: user?.id || 1,
            accion: activo ? 'ACTIVAR_PRODUCTO' : 'DESACTIVAR_PRODUCTO',
            tablaAfectada: 'productos',
            registroId: idNumber,
            datosAnteriores: JSON.stringify(productoActual),
            datosNuevos: JSON.stringify(productoActualizado)
        });
        return productoActualizado;
    }
    //servicio para obtener los 10 productos con mas bajo stock
    async getLowStockProducts() {
        const productos = await producto_repository_1.productoRepository.findLowStockProducts();
        return productos;
    }
    async validarCreacionProducto(data) {
        // Validar código único
        const existeCodigo = await producto_repository_1.productoRepository.findByCodigo(data.codigo);
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
    async validarActualizacionProducto(id, data) {
        // Validar que el producto existe
        const existe = await producto_repository_1.productoRepository.findById(id);
        if (!existe) {
            throw new Error('Producto no encontrado');
        }
        // Si cambia el código, validar que no exista
        if (data.codigo && data.codigo !== existe.codigo) {
            const existeCodigo = await producto_repository_1.productoRepository.findByCodigo(data.codigo);
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
    async validarEliminacionProducto(id) {
        // Verificar si tiene movimientos de stock
        const tieneMovimientos = await this.productoTieneMovimientos(id);
        if (tieneMovimientos) {
            throw new Error('No se puede eliminar un producto con movimientos de stock. Considere desactivarlo.');
        }
    }
    async productoTieneMovimientos(productoId) {
        const count = await database_1.prisma.movimientoStock.count({
            where: { productoId }
        });
        return count > 0;
    }
    async registrarMovimientoInicial(productoId, cantidad, user) {
        await database_1.prisma.movimientoStock.create({
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
    async actualizarStockProducto(productoId, nuevaCantidad) {
        const stockActual = await producto_repository_1.productoRepository.getStockActual(productoId);
        if (stockActual) {
            await producto_repository_1.productoRepository.updateStockActual(productoId, nuevaCantidad);
        }
        else {
            await producto_repository_1.productoRepository.createStockActual(productoId, nuevaCantidad);
        }
    }
    construirDatosActualizacion(data, actual) {
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
    parseId(id) {
        const idNumber = parseInt(id, 10);
        if (isNaN(idNumber)) {
            throw new Error('ID inválido');
        }
        return idNumber;
    }
}
exports.ProductoService = ProductoService;
exports.productoService = new ProductoService();
