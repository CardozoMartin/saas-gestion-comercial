import { Request, Response } from "express";
import { ventaService } from "../services/ventas.services";
import { ICreateVentaInput } from "../types/venta.types";
import { IUpdateVentaDetallesInput } from "../types/ventas.types";

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
            console.log(error)
            return res.status(400).json({ 
                success: false,
                message: 'Error al crear la venta', 
                error: error.message 
            });
        }
    }

    async updateVentaDetalles(req: Request, res: Response): Promise<Response> {
        try {
            const { saleId } = req.params;
            const updateData: IUpdateVentaDetallesInput = req.body;
            const user = req.user;
            
            const venta = await ventaService.updateVentaDetalles(
                parseInt(saleId), 
                updateData, 
                user
            );
            
            return res.status(200).json({
                success: true,
                message: 'Venta actualizada exitosamente',
                data: venta
            });
        } catch (error: any) {
            console.log(error)
            return res.status(400).json({ 
                success: false,
                message: 'Error al actualizar la venta', 
                error: error.message 
            });
        }
    }

    async anularVenta(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { motivoAnulacion } = req.body;
            const user = req.user;
            
            const venta = await ventaService.anularVenta(
                parseInt(id), 
                motivoAnulacion,
                user
            );
            
            return res.status(200).json({
                success: true,
                message: 'Venta anulada exitosamente',
                data: venta
            });
        } catch (error: any) {
            console.log(error)
            return res.status(400).json({ 
                success: false,
                message: 'Error al anular la venta', 
                error: error.message 
            });
        }
    }

    async getAllVentas(req: Request, res: Response): Promise<Response> {
        try {
            const ventas = await ventaService.getAllVentas();
            return res.status(200).json({
                success: true,
                data: ventas
            });
        } catch (error: any) {
            return res.status(400).json({ 
                success: false,
                message: 'Error al obtener las ventas', 
                error: error.message 
            });
        }
    }

    async getVentaById(req: Request, res: Response): Promise<Response> {
        try {
            const { saleId } = req.params;
            const venta = await ventaService.getVentaById(parseInt(saleId));
            
            if (!venta) {
                return res.status(404).json({
                    success: false,
                    message: 'Venta no encontrada'
                });
            }
            
            return res.status(200).json({
                success: true,
                data: venta
            });
        } catch (error: any) {
            return res.status(400).json({ 
                success: false,
                message: 'Error al obtener la venta', 
                error: error.message 
            });
        }
    }
}

export const ventaController = new VentaController();