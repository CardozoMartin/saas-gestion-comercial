import { Router } from 'express';
import { usuarioController } from '@controllers/usuario.controller';
import { authController } from '@controllers/auth.controller';

const router = Router();

// Rutas de Usuario
// Patrón RESTful estándar

router.get('/', usuarioController.getAll.bind(usuarioController));

router.get('/:id', usuarioController.getById.bind(usuarioController));

router.post('/', usuarioController.create.bind(usuarioController));

router.put('/:id', usuarioController.update.bind(usuarioController));

router.delete('/:id', usuarioController.delete.bind(usuarioController));

// Ruta especial para login
router.post('/auth/login', authController.loginUsuario.bind(authController));

export default router;
