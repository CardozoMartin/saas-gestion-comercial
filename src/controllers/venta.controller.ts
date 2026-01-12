import { Request, Response } from "express";
import { ventaService } from "../services/ventas.services";
import { ICreateVentaInput } from "@/types/venta.types";

class VentaController {

    async createVenta(req: Request, res: Response): Promise<Response> {
        try {
            const ventaData: ICreateVentaInput = req.body;
            const user = req.user;
            const venta = await ventaService.createVenta(ventaData, user);
            return res.status(201).json({
                success: true,
                message: 'Venta creada exitosamente',
                data: venta
            });
        } catch (error: any) {
            return res.status(400).json({ 
                success: false,
                message: 'Error al crear la venta', 
                error: error.message 
            });
        }
    }
}

export const ventaController = new VentaController();