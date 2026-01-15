import { Router } from 'express';
import { productoController } from '@controllers/productos.controller';
import { loginDataHandler } from '@middlewares/loginDataHandler';
const router = Router();


router.get('/', productoController.getAll.bind(productoController));
router.get('/allproducts', productoController.getProductosSinPaginacion.bind(productoController));

router.get('/:id', productoController.getById.bind(productoController));
router.post('/', loginDataHandler, productoController.create.bind(productoController));

router.put('/:id', productoController.update.bind(productoController));
router.delete('/:id', productoController.delete.bind(productoController));

export default router;