import { Router } from 'express';
import { rolController } from '../controllers/rol.controller';
import { loginDataHandler } from '../middlewares/loginDataHandler';

const router = Router();

//Get
router.get('/',loginDataHandler, rolController.getAllRoles.bind(rolController)); 

//Post
router.post('/', loginDataHandler, rolController.createRol.bind(rolController));

//Put
router.put('/:id', loginDataHandler, rolController.updateRol.bind(rolController));

//Delete
router.delete('/:id', loginDataHandler, rolController.deleteRol.bind(rolController));

export default router;