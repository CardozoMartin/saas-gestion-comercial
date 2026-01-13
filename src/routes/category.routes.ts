import { Router } from "express";
import { categoryController } from "@/controllers/category.controller";

const router = Router();

router.get('/', categoryController.getAll.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));
router.post('/', categoryController.create.bind(categoryController));
router.put('/:id', categoryController.update.bind(categoryController));

export default router;