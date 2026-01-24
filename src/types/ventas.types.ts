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

// Añade estos tipos a tu archivo venta.types.ts existente

export interface IUpdateVentaDetallesInput {
  detalles: IDetalleVentaUpdate[];
  observaciones?: string;
}

export interface IDetalleVentaUpdate {
  id?: number; // Si existe, se actualiza; si no, se crea nuevo
  productoId: number;
  unidadMedidaId: number;
  cantidad: number;
  precioUnitario: number;
}

// Usar el campo observaciones para marcar el estado real:
// - Venta normal: observaciones normales o null
// - Venta editada: observaciones inicia con "[EDITADA]"
// - Venta anulada: estado = 'cancelada' + observaciones inicia con "[ANULADA]"