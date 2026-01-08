export interface IRol {
    id: number;
    nombre: string;
    descripcion?: string | null;
}

export interface ICreateRol {
    nombre: string;
    descripcion?: string;
}

export interface IUpdateRol {
    nombre?: string;
    descripcion?: string;
}

export interface IAsignarRolUsuario {
    usuarioId: number;
    rolId: number;
}