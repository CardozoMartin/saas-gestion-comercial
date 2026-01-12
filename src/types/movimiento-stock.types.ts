export interface IMovimientoStock {
    id: number;
    productoId: number;
    tipoMovimiento: string;
    cantidad: number;
    motivo: string | null;
    usuarioId: number;
    referenciaId: number | null;
    referenciaTipo: string | null;
    fechaMovimiento: Date;
}

export interface ICreateMovimientoStock {
    productoId: number;
    tipoMovimiento: string;
    cantidad: number;
    motivo?: string | null;
    usuarioId: number;
    referenciaId?: number | null;
    referenciaTipo?: string | null;
}

export interface IUpdateMovimientoStock {
    tipoMovimiento?: string;
    cantidad?: number;
    motivo?: string | null;
    referenciaId?: number | null;
    referenciaTipo?: string | null;
}

export interface IStockActual {
    id: number;
    productoId: number;
    cantidad: number;
    fechaActualizacion: Date;
}

export interface ICreateStockActual {
    productoId: number;
    cantidad?: number;
}

export interface IUpdateStockActual {
    cantidad?: number;
}
