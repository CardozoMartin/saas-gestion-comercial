"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoriaService = void 0;
const categoria_repository_1 = require("@/repositories/categoria.repository");
class CategoriaService {
    async getAllCategorias() {
        return await categoria_repository_1.categoriaRepository.findAll();
    }
    async getCategoriaById(id) {
        const categoria = await categoria_repository_1.categoriaRepository.findById(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }
        return categoria;
    }
    async createCategoria(data) {
        // Validar que no exista otra categoría con el mismo nombre
        const categoriaExistente = await categoria_repository_1.categoriaRepository.findByNombre(data.nombre);
        if (categoriaExistente) {
            throw new Error('Ya existe una categoría con ese nombre');
        }
        return await categoria_repository_1.categoriaRepository.create(data);
    }
    async updateCategoria(id, data) {
        // Validar que la categoría exista
        const categoria = await categoria_repository_1.categoriaRepository.findById(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }
        // Validar que no exista otra categoría con el mismo nombre
        if (data.nombre && data.nombre !== categoria.nombre) {
            const categoriaExistente = await categoria_repository_1.categoriaRepository.findByNombre(data.nombre);
            if (categoriaExistente) {
                throw new Error('Ya existe una categoría con ese nombre');
            }
        }
        return await categoria_repository_1.categoriaRepository.update(id, data);
    }
}
exports.CategoriaService = CategoriaService;
exports.categoryService = new CategoriaService();
