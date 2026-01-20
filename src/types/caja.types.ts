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
    montoInicial: number 
    montoFinal?: number 
    
    // ✅ NUEVOS CAMPOS
    montoFinalContado?: number 
    montoRetirado?: number 
    fondoSiguienteCaja?: number 
    cajaAnteriorId?: number | null;
    
    totalEfectivo?: number 
    totalTransferencias?: number
    totalVentas?: number 
    diferencia?: number 
    estado: string;
    observaciones?: string | null;
    fechaApertura: Date;
    fechaCierre?: Date | null;
}

export interface ICreateCaja {
    usuarioId: number;
    montoInicial?: number; // Ahora opcional
    estado?: string;
    observaciones?: string | null;
    cajaAnteriorId?: number | null; // ✅ NUEVO
}

export interface IUpdateCaja {
    montoFinal?: number;
    montoFinalContado?: number; // ✅ NUEVO
    montoRetirado?: number; // ✅ NUEVO
    fondoSiguienteCaja?: number; // ✅ NUEVO
    totalEfectivo?: number;
    totalTransferencias?: number;
    totalVentas?: number;
    diferencia?: number;
    estado?: string;
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
