"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_controller_1 = require("@controllers/productos.controller");
const loginDataHandler_1 = require("@middlewares/loginDataHandler");
const router = (0, express_1.Router)();
//Rutas para obtener productos
router.get('/', loginDataHandler_1.loginDataHandler, (0, loginDataHandler_1.checkRole)('admin', 'cajero'), productos_controller_1.productoController.getAll.bind(productos_controller_1.productoController));
router.get('/allproducts', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.getProductosSinPaginacion.bind(productos_controller_1.productoController));
router.get('/lowstock', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.getLowStockProducts.bind(productos_controller_1.productoController));
router.get('/:id', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.getById.bind(productos_controller_1.productoController));
router.get('/product/nameorcode', loginDataHandler_1.loginDataHandler, (0, loginDataHandler_1.checkRole)('admin'), productos_controller_1.productoController.getProductosParaActualizacionStock.bind(productos_controller_1.productoController));
//rutas para crear actualizar y eliminar productos
router.post('/', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.create.bind(productos_controller_1.productoController));
router.put('/:id', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.update.bind(productos_controller_1.productoController));
router.put('/change-status/:id', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.changeStatus.bind(productos_controller_1.productoController));
//ruta para actualizar el stock de un producto
router.patch('/:id/stock', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.updateStock.bind(productos_controller_1.productoController));
router.delete('/:id', loginDataHandler_1.loginDataHandler, productos_controller_1.productoController.delete.bind(productos_controller_1.productoController));
exports.default = router;
