import type { Numeric, TipoVenta as _TipoVenta, EstadoVenta as _EstadoVenta } from './prisma-types';

export type TipoVenta = _TipoVenta;
export type EstadoVenta = _EstadoVenta;

export interface IVenta {
    id: number;
    numeroVenta: string;
    clienteId: number | null;
    usuarioId: number;
    tipoVenta: TipoVenta;
    subtotal: Numeric;
    descuento: Numeric;
    total: Numeric;
    estado: EstadoVenta;
    observaciones: string | null;
    fechaVenta: Date;
}

// Tipo para el detalle que llega del frontend
export interface ICreateVentaDetalleInput {
    productoId: number;
    unidadMedidaId: number;
    cantidad: Numeric;
    precioUnitario: Numeric;
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

// EstadoVenta definido por Prisma (usamos la definición generada)

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
    cantidad: Numeric;
    precioUnitario: Numeric;
    subtotal: Numeric;
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
