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

import type { Numeric } from './prisma-types';

export interface IPago {
    id: number;
    ventaId: number | null;
    clienteId: number | null;
    medioPagoId: number;
    monto: Numeric;
    referencia: string | null;
    usuarioId: number;
    fechaPago: Date;
    observaciones: string | null;
}

export interface ICreatePago {
    ventaId?: number | null;
    clienteId?: number | null;
    medioPagoId: number;
    monto: Numeric;
    referencia?: string | null;
    usuarioId: number;
    observaciones?: string | null;
}

export interface IUpdatePago {
    ventaId?: number | null;
    clienteId?: number | null;
    medioPagoId?: number;
    monto?: Numeric;
    referencia?: string | null;
    observaciones?: string | null;
}
