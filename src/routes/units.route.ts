import { Router } from 'express';
import { unitsController } from '@/controllers/units.controller';


const router = Router();

router.get('/', unitsController.getAllUnits.bind(unitsController));
router.get('/:id', unitsController.getUnitById.bind(unitsController));
router.post('/', unitsController.createUnit.bind(unitsController));
router.put('/:id', unitsController.updateUnit.bind(unitsController));
router.delete('/:id', unitsController.deleteUnit.bind(unitsController));
export default router;