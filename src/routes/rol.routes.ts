import { Router } from 'express';
import { rolController } from '@controllers/rol.controller';

const router = Router();

//Get
router.get('/', rolController.getAllRoles.bind(rolController)); 

//Post
router.post('/', rolController.createRol.bind(rolController));

//Put
router.put('/:id', rolController.updateRol.bind(rolController));

//Delete
router.delete('/:id', rolController.deleteRol.bind(rolController));

export default router;