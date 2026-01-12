export interface ICondicionPago {
    id: number;
    nombre: string;
    dias: number;
}

export interface ICreateCondicionPago {
    nombre: string;
    dias: number;
}

export interface IUpdateCondicionPago {
    nombre?: string;
    dias?: number;
}

export interface ICuentaCorriente {
    id: number;
    clienteId: number;
    saldoActual: number;
    condicionPagoId: number | null;
    fechaProximoVencimiento: Date | null;
    fechaActualizacion: Date;
}

export interface ICreateCuentaCorriente {
    clienteId: number;
    saldoActual?: number;
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
}

export interface IUpdateCuentaCorriente {
    saldoActual?: number;
    condicionPagoId?: number | null;
    fechaProximoVencimiento?: Date | null;
}
