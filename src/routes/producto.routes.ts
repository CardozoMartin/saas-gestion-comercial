import { Router } from 'express';
import { productoController } from '../controllers/productos.controller';
import { checkRole, loginDataHandler } from '../middlewares/loginDataHandler';
const router = Router();

//Rutas para obtener productos
router.get('/', loginDataHandler, checkRole('admin', 'cajero'), productoController.getAll.bind(productoController));
router.get('/allproducts', productoController.getProductosSinPaginacion.bind(productoController));
router.get('/lowstock', loginDataHandler, productoController.getLowStockProducts.bind(productoController));
router.get('/:id', loginDataHandler, productoController.getById.bind(productoController));
router.get('/product/nameorcode', loginDataHandler, checkRole('admin'), productoController.getProductosParaActualizacionStock.bind(productoController));

//rutas para crear actualizar y eliminar productos
router.post('/', loginDataHandler, productoController.create.bind(productoController));
router.put('/:id', loginDataHandler, productoController.update.bind(productoController));
router.put('/change-status/:id', loginDataHandler, productoController.changeStatus.bind(productoController));

//ruta para actualizar el stock de un producto
router.patch('/:id/stock', loginDataHandler, productoController.updateStock.bind(productoController));
router.delete('/:id', loginDataHandler, productoController.delete.bind(productoController));

export default router;