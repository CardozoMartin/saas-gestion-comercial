export interface IMedioPago {
    id: number;
    nombre: string;
    requiereReferencia: boolean;
}

export interface ICreateMedioPago {
    nombre: string;
    requiereReferencia?: boolean;
}

export interface IUpdateMedioPago {
    nombre?: string;
    requiereReferencia?: boolean;
}

export interface IPago {
    id: number;
    ventaId: number | null;
    clienteId: number | null;
    medioPagoId: number;
    monto: number;
    referencia: string | null;
    usuarioId: number;
    fechaPago: Date;
    observaciones: string | null;
}

export interface ICreatePago {
    ventaId?: number | null;
    clienteId?: number | null;
    medioPagoId: number;
    monto: number;
    referencia?: string | null;
    usuarioId: number;
    observaciones?: string | null;
}

export interface IUpdatePago {
    ventaId?: number | null;
    clienteId?: number | null;
    medioPagoId?: number;
    monto?: number;
    referencia?: string | null;
    observaciones?: string | null;
}
