export interface IAuditoria {
    id: number;
    usuarioId: number;
    accion: string;
    tablaAfectada: string;
    registroId: number | null;
    datosAnteriores: any | null;
    datosNuevos: any | null;
    ipAddress: string | null;
    userAgent: string | null;
    fechaAccion: Date;
}

export interface ICreateAuditoria {
    usuarioId: number;
    accion: string;
    tablaAfectada: string;
    registroId?: number | null;
    datosAnteriores?: any | null;
    datosNuevos?: any | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export interface IUpdateAuditoria {
    accion?: string;
    tablaAfectada?: string;
    registroId?: number | null;
    datosAnteriores?: any | null;
    datosNuevos?: any | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export interface IAuditoriaCreate {
    usuarioId: number;
    accion: string;
    tablaAfectada: string;
    registroId: number;
    datosAntiguos?: string;
    ipAddress?: string;
    userAgent?: string;
    datosNuevos?: string;
}

