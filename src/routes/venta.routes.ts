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

router.get(
  "/",
  loginDataHandler,
  checkRole("admin", "cajero"),
  ventaController.getAllVentas,
);

router.get(
  "/:saleId",
  loginDataHandler,
  checkRole("admin", "cajero"),
  ventaController.getVentaById,
);

router.put(
  "/:saleId/detalles",
  loginDataHandler,
  checkRole("admin"),
  ventaController.updateVentaDetalles,
);

router.put(
  "/:id/anular",
  loginDataHandler,
  checkRole("admin"),
  ventaController.anularVenta,
);

export default router;
