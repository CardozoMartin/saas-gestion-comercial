import { Router } from "express";
import { categoryController } from "@/controllers/category.controller";
import { loginDataHandler } from "@/middlewares/loginDataHandler";

const router = Router();

router.get('/',loginDataHandler, categoryController.getAll.bind(categoryController));
router.get('/:id', loginDataHandler, categoryController.getById.bind(categoryController));
router.post('/', loginDataHandler, categoryController.create.bind(categoryController));
router.put('/:id', loginDataHandler, categoryController.update.bind(categoryController));

export default router;