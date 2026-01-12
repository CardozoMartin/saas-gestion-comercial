export interface IStock {
    id?: number;
    productoId: number;
    cantidad: number;
}

export interface IStockUpdate {
    cantidad?: number;
}

export interface IStockCreate{
    productoId: number;
    cantidad: number;
}