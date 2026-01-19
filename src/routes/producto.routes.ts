import { Router } from 'express';
import { productoController } from '@controllers/productos.controller';
import { loginDataHandler } from '@middlewares/loginDataHandler';
const router = Router();

//Rutas para obtener productos
router.get('/', productoController.getAll.bind(productoController));
router.get('/allproducts', productoController.getProductosSinPaginacion.bind(productoController));
router.get('/lowstock', productoController.getLowStockProducts.bind(productoController));
router.get('/:id', productoController.getById.bind(productoController));

//rutas para crear actualizar y eliminar productos
router.post('/', loginDataHandler, productoController.create.bind(productoController));
router.put('/:id', productoController.update.bind(productoController));
router.put('/change-status/:id', productoController.changeStatus.bind(productoController));
router.delete('/:id', productoController.delete.bind(productoController));

export default router;