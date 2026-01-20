"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unidadMedidaRepository = exports.UnidadMedidaRepository = void 0;
const database_1 = require("@config/database");
class UnidadMedidaRepository {
    async findAll() {
        return await database_1.prisma.unidadMedida.findMany({
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }
    async findById(id) {
        return await database_1.prisma.unidadMedida.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }
    async findByNombre(nombre) {
        return await database_1.prisma.unidadMedida.findFirst({
            where: { nombre }
        });
    }
    async create(data) {
        return await database_1.prisma.unidadMedida.create({
            data: {
                nombre: data.nombre,
                abreviatura: data.abreviatura
            },
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }
    async update(id, data) {
        return await database_1.prisma.unidadMedida.update({
            where: { id },
            data,
            select: {
                id: true,
                nombre: true,
                abreviatura: true
            }
        });
    }
    async delete(id) {
        await database_1.prisma.unidadMedida.delete({
            where: { id }
        });
    }
}
exports.UnidadMedidaRepository = UnidadMedidaRepository;
exports.unidadMedidaRepository = new UnidadMedidaRepository();
