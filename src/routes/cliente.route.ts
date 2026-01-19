import { Router } from 'express';
import { clienteController } from '@/controllers/cliente.controller';
import { loginDataHandler } from '@/middlewares/loginDataHandler';

const router = Router();

// RUTAS CRUD DE CLIENTES
router.get('/', clienteController.getAllClientes);
router.get('/clientescondeudas', clienteController.getClientesConMayorDeuda)
router.get('/:id', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

// RUTAS DE CUENTA CORRIENTE
router.get('/:id/cuenta-corriente', clienteController.getResumenCuentaCorriente);
router.get('/:id/ventas/:ventaId', clienteController.getDetalleVenta);


// RUTAS DE PAGOS
router.post('/:id/pagar',loginDataHandler, clienteController.pagarCuentaCorriente);
router.post('/:id/pagar-ventas', loginDataHandler, clienteController.pagarVentasEspecificas);

export default router;

