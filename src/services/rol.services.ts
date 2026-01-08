import { rolRepository } from "@/repositories/rol.repository";
import { ICreateRol, IUpdateRol, IAsignarRolUsuario, IRol } from "@/types/rol.types";


export class RolService {

    constructor() { }

    //servicio para obtener todos los roles
    async serviceGetAllRoles():Promise<IRol[]> {
        try {
            const roles = await rolRepository.findAll();
            return roles;
        } catch (error) {
            throw new Error(`Error al obtener roles: ${error}`);
        }
    }

    //servicio para crear un nuevo rol
    async serviceCreateRol(data: ICreateRol):Promise<IRol> {
        try {
            const rol = await rolRepository.create(data);
            return rol;
        } catch (error) {
            throw new Error(`Error al crear rol: ${error}`);
        }
    }
    //servicio para actualizar un rol
    async serviceUpdateRol(id: number, data: IUpdateRol):Promise<IRol> {
        try {
            const rol = await rolRepository.update(id, data);
            return rol;
        } catch (error) {
            throw new Error(`Error al actualizar rol: ${error}`);
        }
    }
    //servicio para eliminar un rol
    async serviceDeleteRol(id: number):Promise<void> {
        try {
            await rolRepository.delete(id);
        } catch (error) {
            throw new Error(`Error al eliminar rol: ${error}`);
        }
    }
  
}

export const rolService = new RolService();