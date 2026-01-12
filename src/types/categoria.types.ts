export interface ICategoria {
    id: number;
    nombre: string;
    descripcion: string | null;
}

export interface ICreateCategoria {
    nombre: string;
    descripcion?: string | null;
}

export interface IUpdateCategoria {
    nombre?: string;
    descripcion?: string | null;
}
