export interface IProducto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    categoriaId: number | null;
    precioCosto: number; // Decimal en BD
    precioVenta: number; // Decimal en BD
    unidadMedidaId: number;
    fraccionable: boolean;
    stockMinimo: number; // Decimal en BD
    activo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}

export interface ICreateProducto {
    codigo: string;
    nombre: string;
    descripcion?: string | null;
    categoriaId?: number | null;
    precioCosto: number;
    precioVenta: number;
    unidadMedidaId: number;
    fraccionable?: boolean;
    stockMinimo?: number;
    cantidadInicial?: number; // Stock inicial al crear el producto (opcional, por defecto 0)
}

export interface IUpdateProducto {
    codigo?: string;
    nombre?: string;
    descripcion?: string | null;
    categoriaId?: number | null;
    precioCosto?: number;
    precioVenta?: number;
    unidadMedidaId?: number;
    fraccionable?: boolean;
    stockMinimo?: number;
    activo?: boolean;
}