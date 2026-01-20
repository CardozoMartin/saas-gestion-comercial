import { Router } from "express";
import { recaudadoController } from "@/controllers/Recaudado.controller";
import { loginDataHandler } from "@/middlewares/loginDataHandler";

const router = Router();

router.get('/pormes',loginDataHandler, recaudadoController.getRecaudadoPorMes);
router.get('/porsemana', loginDataHandler, recaudadoController.getRecaudadoPorSemana);

export default router;