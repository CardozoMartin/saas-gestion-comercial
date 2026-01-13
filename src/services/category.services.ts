import { categoriaRepository } from "@/repositories/categoria.repository";
import { ICreateCategoria, IUpdateCategoria, ICategoria } from "@/types/categoria.types";
import { prisma } from '@config/database';

export class CategoriaService {

    async getAllCategorias(): Promise<ICategoria[]> {
        return await categoriaRepository.findAll();
    }

    async getCategoriaById(id: number): Promise<ICategoria> {
        
        const categoria = await categoriaRepository.findById(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }
        return categoria;
    }

    async createCategoria(data: ICreateCategoria): Promise<ICategoria> {
        // Validar que no exista otra categoría con el mismo nombre
        const categoriaExistente = await categoriaRepository.findByNombre(data.nombre);
        if (categoriaExistente) {
            throw new Error('Ya existe una categoría con ese nombre');
        }
        return await categoriaRepository.create(data);
    }

    async updateCategoria(id: number, data: IUpdateCategoria): Promise<ICategoria> {
        // Validar que la categoría exista
        const categoria = await categoriaRepository.findById(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }
        // Validar que no exista otra categoría con el mismo nombre
        if (data.nombre && data.nombre !== categoria.nombre) {
            const categoriaExistente = await categoriaRepository.findByNombre(data.nombre);
            if (categoriaExistente) {
                throw new Error('Ya existe una categoría con ese nombre');
            }
        }
        return await categoriaRepository.update(id, data);
    }
}

export const categoryService = new CategoriaService();