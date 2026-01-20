"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitsController = exports.UnitsController = void 0;
const units_service_1 = require("@/services/units.service");
class UnitsController {
    async getAllUnits(req, res) {
        try {
            const units = await units_service_1.unitsService.getAllUnits();
            if (units.length === 0) {
                return res.status(404).json({ message: 'No units found' });
            }
            return res.status(200).json(units);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async getUnitById(req, res) {
        try {
            const id = Number(req.params.id);
            const unit = await units_service_1.unitsService.getUnitById(id);
            if (!unit) {
                return res.status(404).json({ message: 'Unit not found' });
            }
            return res.status(200).json(unit);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async createUnit(req, res) {
        try {
            const data = req.body;
            const newUnit = await units_service_1.unitsService.createUnit(data);
            return res.status(201).json(newUnit);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async updateUnit(req, res) {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            const updatedUnit = await units_service_1.unitsService.updateUnit(id, data);
            return res.status(200).json(updatedUnit);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async deleteUnit(req, res) {
        try {
            const id = Number(req.params.id);
            await units_service_1.unitsService.deleteUnit(id);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
}
exports.UnitsController = UnitsController;
exports.unitsController = new UnitsController();
