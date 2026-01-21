export interface ICondicionPago {
    id: number;
    nombre: string;
    dias: number;
}

export interface ICreateCondicionPago {
    nombre: string;
    dias: number;
}

export interface IUpdateCondicionPago {
    nombre?: string;
    dias?: number;
}

import type { Numeric } from './prisma-types';

export interface ICuentaCorriente {
    id: number;
    clienteId: number;
    saldoActual: Numeric;
    condicionPagoId: number | null;
    fechaProximoVencimiento: Date | null;
    fechaActualizacion: Date;
}

export interface ICreateCuentaCorriente {
    clienteId: number;
    saldoActual?: Numeric;
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
}

export interface IUpdateCuentaCorriente {
    saldoActual?: Numeric;
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
}
