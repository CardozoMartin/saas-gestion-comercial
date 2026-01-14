export interface IProducto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoriaId: number | null;
  precioCosto: number; 
  precioVenta: number; 
  unidadMedidaId: number;
  fraccionable: boolean;
  stockMinimo: number; 
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
  cantidadInicial?: number; 
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

// Parámetros para la paginación y filtros
export interface IProductoPagination {
  page?: number; 
  limit?: number; 
  search?: string; 
  categoriaId?: number; 
  activo?: boolean; 
  sortBy?: "nombre" | "codigo" | "precioVenta" | "fechaCreacion"; 
  sortOrder?: "asc" | "desc"; 
}

// Resultado paginado
export interface IProductoPaginatedResult {
  productos: IProducto[];
  total: number; 
  page: number; 
  limit: number; 
  totalPages: number; 
  hasNextPage: boolean; 
  hasPrevPage: boolean; 
}
