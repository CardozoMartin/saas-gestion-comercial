export interface IUnidadMedida {
    id: number;
    nombre: string;
    abreviatura: string;
}

export interface ICreateUnidadMedida {
    nombre: string;
    abreviatura: string;
}

export interface IUpdateUnidadMedida {
    nombre?: string;
    abreviatura?: string;
}
