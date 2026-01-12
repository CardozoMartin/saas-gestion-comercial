export interface IVenta {
    id: number;
    numeroVenta: string;
    clienteId: number | null;
    usuarioId: number;
    tipoVenta: TipoVenta;
    subtotal: number;
    descuento: number;
    total: number;
    estado: EstadoVenta;
    observaciones: string | null;
    fechaVenta: Date;
}

// Tipo para el detalle que llega del frontend
export interface ICreateVentaDetalleInput {
    productoId: number;
    unidadMedidaId: number;
    cantidad: number;
    precioUnitario: number;
}

// Tipo para crear una venta desde el frontend
export interface ICreateVentaInput {
    clienteId?: number | null;
    usuarioId: number;
    tipoVenta: TipoVenta;
    descuento?: number;
    observaciones?: string | null;
    detalles: ICreateVentaDetalleInput[];
}

// Tipo interno para crear la venta en la BD
export interface ICreateVenta {
    numeroVenta: string;
    clienteId?: number | null;
    usuarioId: number;
    tipoVenta: TipoVenta;
    subtotal: number;
    descuento?: number;
    total: number;
    estado?: EstadoVenta;
    observaciones?: string | null;
}

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

export interface IUpdateVenta {
    numeroVenta?: string;
    clienteId?: number | null;
    tipoVenta?: TipoVenta;
    subtotal?: number;
    descuento?: number;
    total?: number;
    estado?: EstadoVenta;
    observaciones?: string | null;
}

export interface IVentaDetalle {
    id: number;
    ventaId: number;
    productoId: number;
    unidadMedidaId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface ICreateVentaDetalle {
    ventaId: number;
    productoId: number;
    unidadMedidaId: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface IUpdateVentaDetalle {
    cantidad?: number;
    precioUnitario?: number;
    subtotal?: number;
}
