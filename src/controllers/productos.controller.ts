import { Request, Response } from "express";
import { productoService } from "../services/producto.services";
import { IProductoPagination, ICreateProducto } from "../types/producto.types";
import { prisma } from "../config/database";

export class ProductoController {
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      // Extraer parámetros de query
      const params: IProductoPagination = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        search: req.query.search as string,
        categoriaId: req.query.categoriaId
          ? parseInt(req.query.categoriaId as string)
          : undefined,
        activo: req.query.activo ? req.query.activo === "true" : undefined,
        sortBy: req.query.sortBy as
          | "nombre"
          | "codigo"
          | "precioVenta"
          | "fechaCreacion",
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };

      const result = await productoService.getAllProductos(params);
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener productos", error });
    }
  }
  async getProductosSinPaginacion(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const productos = await productoService.getProductosSinPaginacion();
      return res.status(200).json(productos);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener productos", error });
    }
  }
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const producto = await productoService.getProductoById(id);
      return res.status(200).json(producto);
    } catch (error) {
      return res.status(404).json({ message: "Producto no encontrado", error });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: ICreateProducto = req.body;
      //veremos por consola los datos del usuario logueado
      const user = req.user;

      const producto = await productoService.createProducto(data, user);
      return res.status(201).json(producto);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error al crear producto", error });
    }
  }
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: Partial<ICreateProducto> = req.body;
      const user = req.user;
      const producto = await productoService.updateProducto(id, data, user);
      return res.status(200).json(producto);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error al actualizar producto", error });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = req.user;
      const producto = await productoService.deleteProducto(id, user);
      return res.status(200).json(producto);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error al eliminar producto", error });
    }
  }

  async changeStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const producto = await productoService.changeProductoStatus(id);
      return res.status(200).json(producto);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error al cambiar estado del producto", error });
    }
  }
  async getLowStockProducts(req: Request, res: Response): Promise<Response> {
    try {
      const productos = await productoService.getLowStockProducts();
      console.log("En controlador - cantidad:", productos.length); // 👈 Agrega esto
      return res.status(200).json({
        success: true,
        count: productos.length, // 👈 Útil para debugging
        data: productos,
      });
    } catch (error) {
      console.error("Error completo:", error); // 👈 Cambia esto para ver el error completo
      return res.status(500).json({
        message: "Error al obtener productos con bajo stock",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
  //controlador para actualizar unicamente el stock de un producto seleccionado
  async updateStock(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      const user = req.user;

      const producto = await productoService.updateProductoStock(
        id,
        Number(cantidad),
        user,
      );
      return res.status(200).json(producto);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error al actualizar stock del producto", error });
    }
  }
  //controlador para obtener productos para hacer la actualizacion de stock
  async getProductosParaActualizacionStock(
    req: Request,
    res: Response,
  ): Promise<Response> {
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
      const productos = await prisma.$queryRaw<any[]>`
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
    } catch (error: any) {
      console.error("Error al buscar productos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al buscar productos",
        error: error.message,
      });
    }
  }
  //controlador para obtener productos por nombre o codigo
  async getProductosPorNombreOCodigo(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { nombreOcodigo } = req.params;
      if (!nombreOcodigo || typeof nombreOcodigo !== "string") {
        return res.status(400).json({
          success: false,
          message: 'El parámetro "nombreOcodigo" es requerido',
        });
      }
      const productos = await productoService.getProductosPorNombreOCodigo(
        nombreOcodigo,
      );
      return res.status(200).json({
        success: true,
        count: productos.length,
        data: productos,
      });
    } catch (error: any) {
      console.error("Error al buscar productos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al buscar productos",
        error: error.message,
      });
    }
}
}

export const productoController = new ProductoController();
