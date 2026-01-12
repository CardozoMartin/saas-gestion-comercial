export enum EstadoCaja {
    abierta = 'abierta',
    cerrada = 'cerrada'
}

export enum TipoMovimientoCaja {
    venta = 'venta',
    retiro = 'retiro',
    ingreso = 'ingreso'
}

export interface ICaja {
    id: number;
    usuarioId: number;
    montoInicial: number;
    montoFinal: number | null;
    totalEfectivo: number | null;
    totalTransferencias: number | null;
    totalVentas: number | null;
    diferencia: number | null;
    estado: EstadoCaja;
    observaciones: string | null;
    fechaApertura: Date;
    fechaCierre: Date | null;
}

export interface ICreateCaja {
    usuarioId: number;
    montoInicial: number;
    estado?: EstadoCaja;
    observaciones?: string | null;
}

export interface IUpdateCaja {
    montoFinal?: number | null;
    totalEfectivo?: number | null;
    totalTransferencias?: number | null;
    totalVentas?: number | null;
    diferencia?: number | null;
    estado?: EstadoCaja;
    observaciones?: string | null;
}

export interface ICajaMovimiento {
    id: number;
    cajaId: number;
    pagoId: number | null;
    tipoMovimiento: TipoMovimientoCaja;
    medioPagoId: number;
    monto: number;
    descripcion: string | null;
    fechaMovimiento: Date;
}

export interface ICreateCajaMovimiento {
    cajaId: number;
    pagoId?: number | null;
    tipoMovimiento: TipoMovimientoCaja;
    medioPagoId: number;
    monto: number;
    descripcion?: string | null;
}

export interface IUpdateCajaMovimiento {
    tipoMovimiento?: string;
    medioPagoId?: number;
    monto?: number;
    descripcion?: string | null;
}
