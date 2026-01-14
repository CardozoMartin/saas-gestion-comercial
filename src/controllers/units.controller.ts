import { Request, Response } from "express";
import { unitsService } from "@/services/units.service";
import { ICreateUnidadMedida, IUpdateUnidadMedida } from "@/types/unidad-medida.types";

export class UnitsController {

    async getAllUnits(req: Request, res: Response): Promise<Response> {
        try {
            const units = await unitsService.getAllUnits();
            if(units.length === 0) {
                return res.status(404).json({ message: 'No units found' });
            }
            return res.status(200).json(units);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async getUnitById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const unit = await unitsService.getUnitById(id);
            if (!unit) {
                return res.status(404).json({ message: 'Unit not found' });
            }
            return res.status(200).json(unit);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async createUnit(req: Request, res: Response): Promise<Response> {
        try {
            const data: ICreateUnidadMedida = req.body;
            const newUnit = await unitsService.createUnit(data);
            return res.status(201).json(newUnit);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async updateUnit(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            const data: Partial<IUpdateUnidadMedida> = req.body;
            const updatedUnit = await unitsService.updateUnit(id, data);
            return res.status(200).json(updatedUnit);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async deleteUnit(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);
            await unitsService.deleteUnit(id);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
}

export const unitsController = new UnitsController();