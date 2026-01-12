export interface ICliente {
    id: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellido: string | null;
    razonSocial: string | null;
    email: string | null;
    telefono: string | null;
    direccion: string | null;
    limiteCredito: number;
    activo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}

export interface ICreateCliente {
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellido?: string | null;
    razonSocial?: string | null;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    limiteCredito?: number;
}

export interface IUpdateCliente {
    tipoDocumento?: string;
    numeroDocumento?: string;
    nombre?: string;
    apellido?: string | null;
    razonSocial?: string | null;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    limiteCredito?: number;
    activo?: boolean;
}
