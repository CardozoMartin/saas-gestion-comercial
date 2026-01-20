export enum EstadoCaja {
    abierta = 'abierta',
    cerrada = 'cerrada'
}

import type { TipoMovimientoCaja, Numeric } from './prisma-types';

export interface ICaja {
    id: number;
    usuarioId: number;
    montoInicial: Numeric;
    montoFinal?: Numeric;
    
    // ✅ NUEVOS CAMPOS
    montoFinalContado?: Numeric;
    montoRetirado?: Numeric;
    fondoSiguienteCaja?: Numeric;
    cajaAnteriorId?: number | null;
    
    totalEfectivo?: Numeric;
    totalTransferencias?: Numeric;
    totalVentas?: Numeric;
    diferencia?: Numeric;
    estado: string;
    observaciones?: string | null;
    fechaApertura: Date;
    fechaCierre?: Date | null;
}

export interface ICreateCaja {
    usuarioId: number;
    montoInicial?: Numeric; // Ahora opcional
    estado?: string;
    observaciones?: string | null;
    cajaAnteriorId?: number | null; // ✅ NUEVO
}

export interface IUpdateCaja {
    montoFinal?: Numeric;
    montoFinalContado?: Numeric; // ✅ NUEVO
    montoRetirado?: Numeric; // ✅ NUEVO
    fondoSiguienteCaja?: Numeric; // ✅ NUEVO
    totalEfectivo?: Numeric;
    totalTransferencias?: Numeric;
    totalVentas?: Numeric;
    diferencia?: Numeric;
    estado?: string;
    observaciones?: string | null;
    fechaCierre?: Date | null; // Agregado para registrar fecha de cierre
}

export interface ICajaMovimiento {
    id: number;
    cajaId: number;
    pagoId: number | null;
    tipoMovimiento: TipoMovimientoCaja;
    medioPagoId: number;
    monto: Numeric;
    descripcion: string | null;
    fechaMovimiento: Date;
}

export interface ICreateCajaMovimiento {
    cajaId: number;
    pagoId?: number | null;
    tipoMovimiento: TipoMovimientoCaja;
    medioPagoId: number;
    monto: Numeric;
    descripcion?: string | null;
}

export interface IUpdateCajaMovimiento {
    tipoMovimiento?: TipoMovimientoCaja;
    medioPagoId?: number;
    monto?: Numeric;
    descripcion?: string | null;
}
