export interface IProducto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string | null;      
    precioCosto: number;
    precioVenta: number;
    fraccionable: boolean;
    stockMinimo: number;
    activo: boolean;
    categoriaId?: number | null;     
    unidadMedidaId: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}