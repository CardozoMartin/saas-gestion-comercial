"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaRepository = exports.CategoriaRepository = void 0;
const database_1 = require("@config/database");
class CategoriaRepository {
    async findAll() {
        return await database_1.prisma.categoria.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.categoria.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }
    async findByNombre(nombre) {
        return await database_1.prisma.categoria.findFirst({
            where: { nombre }
        });
    }
    async create(data) {
        return await database_1.prisma.categoria.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion || null
            },
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }
    async update(id, data) {
        return await database_1.prisma.categoria.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                descripcion: true
            }
        });
    }
    async delete(id) {
        await database_1.prisma.categoria.delete({
            where: { id }
        });
    }
}
exports.CategoriaRepository = CategoriaRepository;
exports.categoriaRepository = new CategoriaRepository();
