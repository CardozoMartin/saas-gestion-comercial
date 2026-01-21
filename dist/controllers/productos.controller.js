"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoController = exports.ProductoController = void 0;
const producto_services_1 = require("../services/producto.services");
const database_1 = require("@/config/database");
class ProductoController {
    async getAll(req, res) {
        try {
            // Extraer parámetros de query
            const params = {
                page: req.query.page ? parseInt(req.query.page) : undefined,
                limit: req.query.limit
                    ? parseInt(req.query.limit)
                    : undefined,
                search: req.query.search,
                categoriaId: req.query.categoriaId
                    ? parseInt(req.query.categoriaId)
                    : undefined,
                activo: req.query.activo ? req.query.activo === "true" : undefined,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
            };
            const result = await producto_services_1.productoService.getAllProductos(params);
            return res.status(200).json(result);
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Error al obtener productos", error });
        }
    }
    async getProductosSinPaginacion(req, res) {
        try {
            const productos = await producto_services_1.productoService.getProductosSinPaginacion();
            return res.status(200).json(productos);
        }
        catch (error) {
            return res
                .status(500)
                .json({ message: "Error al obtener productos", error });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const producto = await producto_services_1.productoService.getProductoById(id);
            return res.status(200).json(producto);
        }
        catch (error) {
            return res.status(404).json({ message: "Producto no encontrado", error });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            //veremos por consola los datos del usuario logueado
            const user = req.user;
            const producto = await producto_services_1.productoService.createProducto(data, user);
            return res.status(201).json(producto);
        }
        catch (error) {
            return res
                .status(400)
                .json({ message: "Error al crear producto", error });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = req.user;
            const producto = await producto_services_1.productoService.updateProducto(id, data, user);
            return res.status(200).json(producto);
        }
        catch (error) {
            return res
                .status(400)
                .json({ message: "Error al actualizar producto", error });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const producto = await producto_services_1.productoService.deleteProducto(id, user);
            return res.status(200).json(producto);
        }
        catch (error) {
            return res
                .status(400)
                .json({ message: "Error al eliminar producto", error });
        }
    }
    async changeStatus(req, res) {
        try {
            const { id } = req.params;
            const producto = await producto_services_1.productoService.changeProductoStatus(id);
            return res.status(200).json(producto);
        }
        catch (error) {
            return res
                .status(400)
                .json({ message: "Error al cambiar estado del producto", error });
        }
    }
    async getLowStockProducts(req, res) {
        try {
            const productos = await producto_services_1.productoService.getLowStockProducts();
            console.log("En controlador - cantidad:", productos.length); // 👈 Agrega esto
            return res.status(200).json({
                success: true,
                count: productos.length, // 👈 Útil para debugging
                data: productos,
            });
        }
        catch (error) {
            console.error("Error completo:", error); // 👈 Cambia esto para ver el error completo
            return res.status(500).json({
                message: "Error al obtener productos con bajo stock",
                error: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }
    //controlador para actualizar unicamente el stock de un producto seleccionado
    async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { cantidad } = req.body;
            const user = req.user;
            const producto = await producto_services_1.productoService.updateProductoStock(id, Number(cantidad), user);
            return res.status(200).json(producto);
        }
        catch (error) {
            return res
                .status(400)
                .json({ message: "Error al actualizar stock del producto", error });
        }
    }
    //controlador para obtener productos para hacer la actualizacion de stock
    async getProductosParaActualizacionStock(req, res) {
        try {
            // 1️⃣ Obtener el parámetro de búsqueda desde query params
            const { search } = req.query;
            // Validar que venga el parámetro
            if (!search || typeof search !== "string") {
                return res.status(400).json({
                    success: false,
                    message: 'El parámetro "search" es requerido',
                });
            }
            // 2️⃣ Preparar el patrón de búsqueda
            const searchPattern = `%${search}%`;
            // 3️⃣ Ejecutar la query con Prisma.sql
            const productos = await database_1.prisma.$queryRaw `
      SELECT 
        p.id,
        p.codigo,
        p.nombre,
        COALESCE(s.cantidad, 0) as stock
      FROM productos p
      LEFT JOIN stock_actual s ON p.id = s.producto_id
      WHERE (
        p.nombre LIKE ${searchPattern}
        OR p.codigo LIKE ${searchPattern}
      )
      AND p.activo = 1
      ORDER BY p.nombre ASC
      LIMIT 50
    `;
            return res.status(200).json({
                success: true,
                count: productos.length,
                data: productos,
            });
        }
        catch (error) {
            console.error("Error al buscar productos:", error);
            return res.status(500).json({
                success: false,
                message: "Error al buscar productos",
                error: error.message,
            });
        }
    }
}
exports.ProductoController = ProductoController;
exports.productoController = new ProductoController();
