import { Producto } from "@prisma/client";
import { Request, Response } from "express";
import { productoService } from "../services/producto.services";
import { IProductoPagination } from "@/types/producto.types";

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
  async getProductosSinPaginacion(req: Request, res: Response): Promise<Response> {
    try {
        const productos = await productoService.getProductosSinPaginacion();
        return res.status(200).json(productos);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener productos', error });
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
      const data: Producto = req.body;
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
      const data: Partial<Producto> = req.body;
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
      const producto = await productoService.deleteProducto(id);
      return res.status(200).json(producto);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error al eliminar producto", error });
    }
  }
}

export const productoController = new ProductoController();
