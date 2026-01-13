import e, { Request, Response } from 'express';
import { categoryService } from '../services/category.services';


export class CategoryController {

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = await categoryService.getAllCategorias();
            return res.status(200).json(categorias);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener categorías', error });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const categoria = await categoryService.getCategoriaById(Number(id));
            return res.status(200).json(categoria);
        } catch (error) {
            return res.status(404).json({ message: 'Categoría no encontrada', error });
        }
    }
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body;
            const categoria = await categoryService.createCategoria(data);
            return res.status(201).json(categoria);
        } catch (error) {
            return res.status(400).json({ message: 'Error al crear categoría', error });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const data = req.body;
            const categoria = await categoryService.updateCategoria(Number(id), data);
            return res.status(200).json(categoria);
        } catch (error) {
            return res.status(400).json({ message: 'Error al actualizar categoría', error });
        }
    }


}

export const categoryController = new CategoryController();