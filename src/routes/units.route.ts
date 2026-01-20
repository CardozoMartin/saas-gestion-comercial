import { Router } from 'express';
import { unitsController } from '../controllers/units.controller';
import { loginDataHandler } from '../middlewares/loginDataHandler';


const router = Router();

router.get('/',loginDataHandler, unitsController.getAllUnits.bind(unitsController));
router.get('/:id', loginDataHandler, unitsController.getUnitById.bind(unitsController));
router.post('/', loginDataHandler, unitsController.createUnit.bind(unitsController));
router.put('/:id', loginDataHandler, unitsController.updateUnit.bind(unitsController));
router.delete('/:id', loginDataHandler, unitsController.deleteUnit.bind(unitsController));
export default router;