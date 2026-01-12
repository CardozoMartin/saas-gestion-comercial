// Interfaz para las respuestas de Usuario (sin la contraseña)
export interface IUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Interfaz para crear usuario (lo que recibimos del cliente)
export interface ICreateUsuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
}

// Interfaz para actualizar usuario
export interface IUpdateUsuario {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  activo?: boolean;
}

// Interfaz para login
export interface ILoginUsuario {
  email: string;
  password: string;
}

// Interfaz interna para usuario con contraseña
export interface DtoUsuarioInterno extends IUsuario {
  password: string;
}

// Interfaz para respuesta de login
export interface ILoginResponse {
  message: string;
  token: string;
  usuario: IUsuario;
}
