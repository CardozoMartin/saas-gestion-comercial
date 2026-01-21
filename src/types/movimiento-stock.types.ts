import type { Numeric, TipoMovimientoStock } from './prisma-types';

export interface IMovimientoStock {
    id: number;
    productoId: number;
    tipoMovimiento: TipoMovimientoStock;
    cantidad: Numeric;
    motivo: string | null;
    usuarioId: number;
    referenciaId: number | null;
    referenciaTipo: string | null;
    fechaMovimiento: Date;
}

export interface ICreateMovimientoStock {
    productoId: number;
    tipoMovimiento: TipoMovimientoStock;
    cantidad: Numeric;
    motivo?: string | null;
    usuarioId: number;
    referenciaId?: number | null;
    referenciaTipo?: string | null;
}

export interface IUpdateMovimientoStock {
    tipoMovimiento?: TipoMovimientoStock;
    cantidad?: Numeric;
    motivo?: string | null;
    referenciaId?: number | null;
    referenciaTipo?: string | null;
}

export interface IStockActual {
    id: number;
    productoId: number;
    cantidad: Numeric;
    fechaActualizacion: Date;
}

export interface ICreateStockActual {
    productoId: number;
    cantidad?: Numeric;
}

export interface IUpdateStockActual {
    cantidad?: Numeric;
}
