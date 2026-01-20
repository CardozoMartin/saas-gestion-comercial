"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const express_1 = require("express");
const usuario_routes_1 = __importDefault(require("./usuario.routes"));
const rol_routes_1 = __importDefault(require("./rol.routes"));
const producto_routes_1 = __importDefault(require("./producto.routes"));
const venta_routes_1 = __importDefault(require("./venta.routes"));
const caja_routes_1 = __importDefault(require("./caja.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const units_route_1 = __importDefault(require("./units.route"));
const cliente_route_1 = __importDefault(require("./cliente.route"));
const recaudado_route_1 = __importDefault(require("./recaudado.route"));
const registerRoutes = (app) => {
    const router = (0, express_1.Router)();
    router.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'API is healthy',
            time: new Date().toISOString()
        });
    });
    // Rutas de Usuarios
    router.use('/usuarios', usuario_routes_1.default);
    router.use('/rols', rol_routes_1.default);
    router.use('/productos', producto_routes_1.default);
    router.use('/ventas', venta_routes_1.default);
    router.use('/cajas', caja_routes_1.default);
    router.use('/categories', category_routes_1.default);
    router.use('/units', units_route_1.default);
    router.use('/clientes', cliente_route_1.default);
    router.use('/recaudado', recaudado_route_1.default);
    app.use('/api/v1', router);
};
exports.registerRoutes = registerRoutes;
