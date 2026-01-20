"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitsService = exports.UnitsService = void 0;
const unidad_medida_repository_1 = require("@repositories/unidad-medida.repository");
class UnitsService {
    async getAllUnits() {
        const unidadMedidaRepository = new unidad_medida_repository_1.UnidadMedidaRepository();
        return await unidadMedidaRepository.findAll();
    }
    async getUnitById(id) {
        const unidadMedidaRepository = new unidad_medida_repository_1.UnidadMedidaRepository();
        return await unidadMedidaRepository.findById(id);
    }
    async createUnit(data) {
        const unidadMedidaRepository = new unidad_medida_repository_1.UnidadMedidaRepository();
        return await unidadMedidaRepository.create(data);
    }
    async updateUnit(id, data) {
        const unidadMedidaRepository = new unidad_medida_repository_1.UnidadMedidaRepository();
        return await unidadMedidaRepository.update(id, data);
    }
    async deleteUnit(id) {
        const unidadMedidaRepository = new unidad_medida_repository_1.UnidadMedidaRepository();
        return await unidadMedidaRepository.delete(id);
    }
}
exports.UnitsService = UnitsService;
exports.unitsService = new UnitsService();
