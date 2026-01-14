import {UnidadMedidaRepository} from '@repositories/unidad-medida.repository';
import {IUnidadMedida, ICreateUnidadMedida, IUpdateUnidadMedida } from '../types/unidad-medida.types'

export class UnitsService {

    async getAllUnits(): Promise<IUnidadMedida[]> {
        const unidadMedidaRepository = new UnidadMedidaRepository();
        return await unidadMedidaRepository.findAll();
    }

    async getUnitById(id: number): Promise<IUnidadMedida | null> {
        const unidadMedidaRepository = new UnidadMedidaRepository();
        return await unidadMedidaRepository.findById(id);
    }

    async createUnit(data: ICreateUnidadMedida): Promise<IUnidadMedida> {
        const unidadMedidaRepository = new UnidadMedidaRepository();
        return await unidadMedidaRepository.create(data);
    }

    async updateUnit(id: number, data: Partial<IUpdateUnidadMedida>): Promise<IUnidadMedida> {
        const unidadMedidaRepository = new UnidadMedidaRepository();
        return await unidadMedidaRepository.update(id, data);
    }

    async deleteUnit(id: number): Promise<void> {
        const unidadMedidaRepository = new UnidadMedidaRepository();
        return await unidadMedidaRepository.delete(id);
    }
}

export const unitsService = new UnitsService();