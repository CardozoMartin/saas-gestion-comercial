"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventaController = void 0;
const ventas_services_1 = require("../services/ventas.services");
class VentaController {
    async createVenta(req, res) {
        try {
            const ventaData = req.body;
            const user = req.user;
            const venta = await ventas_services_1.ventaService.createVenta(ventaData, user);
            return res.status(201).json({
                success: true,
                message: 'Venta creada exitosamente',
                data: venta
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: 'Error al crear la venta',
                error: error.message
            });
        }
    }
}
exports.ventaController = new VentaController();
