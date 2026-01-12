import { prisma } from "@/config/database";
import { IStock, IStockCreate, IStockUpdate } from "@/types/stock.types";


class StockRepository {

    async findAll(): Promise<IStock[]> {
        return await prisma.stockActual.findMany({
            select: {
                id: true,
                productoId: true,
                cantidad: true,
            }
        });
    }

    async findByProductoId(productoId: number): Promise<IStock | null> {
        return await prisma.stockActual.findUnique({
            where: { productoId },
            select: {
                id: true,
                productoId: true,
                cantidad: true,
            }
        });
    }

    async create(data: IStockCreate): Promise<IStock> {
        return await prisma.stockActual.create({
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
    async update(productoId: number, data: IStockUpdate): Promise<IStock> {
        return await prisma.stockActual.update({
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

export const stockRepository = new StockRepository();