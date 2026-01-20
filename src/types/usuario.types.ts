// Interfaz para las respuestas de Usuario (sin la contraseña)
export interface IUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  rol?: string; // opcional, puede provenir de una relación
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Interfaz para crear usuario (lo que recibimos del cliente)
export interface ICreateUsuario {
  nombre: string;
  apellido: string;
  email: string;
  rolId:number;
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

// Interfaz interna para usuario con contraseña y roles
export interface DtoUsuarioInterno extends IUsuario {
  password: string;
  roles?: Array<{ id: number; nombre: string; descripcion?: string }>; // compatibilidad con la consulta que trae roles
}

// Interfaz para respuesta de login
export interface ILoginResponse {
  message: string;
  token: string;
  usuario: IUsuario;
}
