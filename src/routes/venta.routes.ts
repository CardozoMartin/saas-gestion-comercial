import { Router } from 'express';
import { ventaController } from '../controllers/venta.controller';
import { loginDataHandler } from '@/middlewares/loginDataHandler';

const router = Router();

router.post('/',loginDataHandler, ventaController.createVenta);

export default router;