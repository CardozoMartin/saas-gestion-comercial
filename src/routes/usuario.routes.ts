import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { authController } from '../controllers/auth.controller';
import { loginDataHandler } from '../middlewares/loginDataHandler';

const router = Router();

// Rutas de Usuario
// Patrón RESTful estándar

router.get('/',loginDataHandler, usuarioController.getAll.bind(usuarioController));

router.get('/:id', loginDataHandler, usuarioController.getById.bind(usuarioController));

router.post('/', loginDataHandler, usuarioController.create.bind(usuarioController));
router.put('/:id', loginDataHandler, usuarioController.update.bind(usuarioController));

router.delete('/:id', loginDataHandler, usuarioController.delete.bind(usuarioController));

// Ruta especial para login
router.post('/auth/login', authController.loginUsuario.bind(authController));

export default router;
