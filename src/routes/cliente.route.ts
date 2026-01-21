import { Router } from 'express';
import { clienteController } from '../controllers/cliente.controller';
import { loginDataHandler } from '../middlewares/loginDataHandler';

const router = Router();

// RUTAS CRUD DE CLIENTES
router.get('/',loginDataHandler, clienteController.getAllClientes);
router.get('/clientescondeudas', loginDataHandler, clienteController.getClientesConMayorDeuda)
router.get('/:id', loginDataHandler, clienteController.getClienteById);
router.post('/', loginDataHandler, clienteController.createCliente);
router.patch('/:id/activo', loginDataHandler, clienteController.toggleClienteActivo);
router.put('/:id', loginDataHandler, clienteController.updateCliente);
router.delete('/:id', loginDataHandler, clienteController.deleteCliente);

// RUTAS DE CUENTA CORRIENTE
router.get('/:id/cuenta-corriente', loginDataHandler, clienteController.getResumenCuentaCorriente);
router.get('/:id/ventas/:ventaId', loginDataHandler, clienteController.getDetalleVenta);


// RUTAS DE PAGOS
router.post('/:id/pagar',loginDataHandler, clienteController.pagarCuentaCorriente);
router.post('/:id/pagar-ventas', loginDataHandler, clienteController.pagarVentasEspecificas);

export default router;

