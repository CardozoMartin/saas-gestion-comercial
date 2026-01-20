"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const category_services_1 = require("../services/category.services");
class CategoryController {
    async getAll(req, res) {
        try {
            const categorias = await category_services_1.categoryService.getAllCategorias();
            return res.status(200).json(categorias);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error al obtener categorías', error });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const categoria = await category_services_1.categoryService.getCategoriaById(Number(id));
            return res.status(200).json(categoria);
        }
        catch (error) {
            return res.status(404).json({ message: 'Categoría no encontrada', error });
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const categoria = await category_services_1.categoryService.createCategoria(data);
            return res.status(201).json(categoria);
        }
        catch (error) {
            return res.status(400).json({ message: 'Error al crear categoría', error });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const categoria = await category_services_1.categoryService.updateCategoria(Number(id), data);
            return res.status(200).json(categoria);
        }
        catch (error) {
            return res.status(400).json({ message: 'Error al actualizar categoría', error });
        }
    }
}
exports.CategoryController = CategoryController;
exports.categoryController = new CategoryController();
