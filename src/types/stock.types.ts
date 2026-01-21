import type { Numeric } from './prisma-types';

export interface IStock {
    id?: number;
    productoId: number;
    cantidad: Numeric;
}

export interface IStockUpdate {
    cantidad?: Numeric;
}

export interface IStockCreate{
    productoId: number;
    cantidad: Numeric;
}