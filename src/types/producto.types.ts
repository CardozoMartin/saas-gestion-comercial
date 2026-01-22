import type { Numeric } from './prisma-types';

export interface IProducto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoriaId: number | null;
  precioCosto: Numeric;
  precioVenta: Numeric;
  unidadMedidaId: number;
  fraccionable: boolean;
  stockMinimo: Numeric;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  // Relaciones opcionales que pueden venir de las consultas con includes
  stockActual?: { cantidad: Numeric } | null;
  categoria?: { id: number; nombre: string } | null;
  unidadMedida?: { id: number; nombre: string } | null;
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
  // Unidad opcional de la cantidad inicial (si no se indica, se asume la unidad del producto)
  cantidadInicialUnidadId?: number;
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
  cantidadInicial?: number;
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
