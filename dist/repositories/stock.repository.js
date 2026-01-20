"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockRepository = void 0;
const database_1 = require("@/config/database");
class StockRepository {
    async findAll() {
        return await database_1.prisma.stockActual.findMany({
            select: {
                id: true,
                productoId: true,
                cantidad: true,
            }
        });
    }
    async findByProductoId(productoId) {
        return await database_1.prisma.stockActual.findUnique({
            where: { productoId },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
            }
        });
    }
    async create(data) {
        return await database_1.prisma.stockActual.create({
            data: {
                productoId: data.productoId,
                cantidad: data.cantidad,
            },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
            }
        });
    }
    async update(productoId, data) {
        return await database_1.prisma.stockActual.update({
            where: { productoId },
            data: {
                cantidad: data.cantidad,
            },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
            }
        });
    }
}
exports.stockRepository = new StockRepository();
