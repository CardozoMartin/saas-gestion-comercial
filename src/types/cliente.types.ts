import type { Numeric } from './prisma-types';

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
    limiteCredito: Numeric;
    activo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
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
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
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
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
}
