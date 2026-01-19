import { Router } from "express";
import { recaudadoController } from "@/controllers/Recaudado.controller";

const router = Router();

router.get('/pormes', recaudadoController.getRecaudadoPorMes);
router.get('/porsemana', recaudadoController.getRecaudadoPorSemana);

export default router;