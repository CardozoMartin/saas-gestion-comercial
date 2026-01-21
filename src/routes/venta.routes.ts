import { Router } from "express";
import { ventaController } from "../controllers/venta.controller";
import { checkRole, loginDataHandler } from "../middlewares/loginDataHandler";

const router = Router();

router.post(
  "/",
  loginDataHandler,
  checkRole("admin", "cajero"),
  ventaController.createVenta,
);

export default router;
