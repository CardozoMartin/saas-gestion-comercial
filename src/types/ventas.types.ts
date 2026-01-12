export enum TipoVenta {
    contado = 'contado',
    cuenta_corriente = 'cuenta_corriente',
    transferencia = 'transferencia'
}

export enum EstadoVenta {
    pendiente = 'pendiente',
    pagada = 'pagada',
    cancelada = 'cancelada'
}

export interface IVentas {
    id?: number;
    numeroVenta: string;
    usuarioId: number;
    clienteId?: number;
    tipoVenta: TipoVenta;
    subtotal: number;
    descuento: number;
    total: number;
    estado: EstadoVenta;
    observaciones?: string;
}

export interface IVentasUpdate {
    numeroVenta?: string;
    usuarioId?: number;
    clienteId?: number;
    tipoVenta?: TipoVenta;
    subtotal?: number;
    descuento?: number;
    total?: number;
    estado?: EstadoVenta;
    observaciones?: string;
}

export interface IVentasFilters {
    numeroVenta?: string;
    usuarioId?: number;
    clienteId?: number;
    tipoVenta?: TipoVenta;
    subtotal?: number;
    descuento?: number;
    total?: number;
    estado?: EstadoVenta;
}

export interface IVentasCreate {
    numeroVenta: string;
    usuarioId: number;
    clienteId?: number;
    tipoVenta: TipoVenta;
    subtotal: number;
    descuento: number;
    total: number;
    estado: EstadoVenta;
    observaciones?: string;
}