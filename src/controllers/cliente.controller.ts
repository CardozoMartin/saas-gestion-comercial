import { Request, Response } from 'express';
import { clienteService } from '@/services/cliente.service';
import { prisma } from '@/config/database';

export class ClienteController {

    async getAllClientes(req: Request, res: Response) {
        try {
            const clientes = await clienteService.getAllClientes();
            return res.status(200).json(clientes);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getClienteById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const cliente = await clienteService.getClienteById(id);
            return res.status(200).json(cliente);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }
    async createCliente(req: Request, res: Response) {
        try {
            const cliente = await clienteService.createCliente(req.body);
            return res.status(201).json(cliente);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async updateCliente(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const cliente = await clienteService.updateCliente(id, req.body);
            return res.status(200).json(cliente);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async deleteCliente(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await clienteService.deleteCliente(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    // MÉTODOS DE CUENTA CORRIENTE
    async getResumenCuentaCorriente(req: Request, res: Response) {
        try {
            const clienteId = parseInt(req.params.id);
            const resumen = await clienteService.getResumenCuentaCorriente(clienteId);
            return res.status(200).json(resumen);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getDetalleVenta(req: Request, res: Response) {
        try {
            const ventaId = parseInt(req.params.ventaId);
            const detalle = await clienteService.getDetalleVenta(ventaId);
            return res.status(200).json(detalle);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }
    // MÉTODOS DE PAGO
    async pagarCuentaCorriente(req: Request, res: Response) {
        try {
            const clienteId = parseInt(req.params.id);
            const { monto, medioPagoId, referencia, observaciones } = req.body;
            const user = req.user;
            const usuarioId = user?.id;

            if (!monto || monto <= 0) {
                return res.status(400).json({
                    error: 'El monto debe ser mayor a cero'
                });
            }

            if (!medioPagoId) {
                return res.status(400).json({
                    error: 'Debe especificar un medio de pago'
                });
            }

            const resultado = await clienteService.pagarCuentaCorriente({
                clienteId,
                monto: parseFloat(monto),
                medioPagoId: parseInt(medioPagoId),
                referencia,
                usuarioId,
                observaciones
            });

            return res.status(200).json({
                message: resultado.mensaje,
                data: {
                    pagoId: resultado.pago.id,
                    montoPagado: resultado.pago.monto,
                    saldoAnterior: resultado.saldoAnterior,
                    saldoNuevo: resultado.saldoNuevo,
                    fechaPago: resultado.pago.fechaPago
                }
            });

        } catch (error: any) {
            console.error('Error en pagar cuenta corriente:', error);
            return res.status(500).json({
                error: error.message || 'Error al procesar el pago'
            });
        }
    }
    async pagarVentasEspecificas(req: Request, res: Response) {
        try {
            const clienteId = parseInt(req.params.id);
            const { ventasAPagar, medioPagoId, referencia } = req.body;
            const usuarioId = req.user?.id;

            if (!Array.isArray(ventasAPagar) || ventasAPagar.length === 0) {
                return res.status(400).json({
                    error: 'Debe especificar al menos una venta a pagar'
                });
            }

            for (const item of ventasAPagar) {
                if (!item.ventaId || !item.monto || item.monto <= 0) {
                    return res.status(400).json({
                        error: 'Formato inválido en ventasAPagar'
                    });
                }
            }

            const resultado = await clienteService.pagarVentasEspecificas({
                clienteId,
                ventasAPagar,
                medioPagoId: parseInt(medioPagoId),
                referencia,
                usuarioId
            });

            return res.status(200).json({
                message: 'Pago procesado exitosamente',
                data: resultado
            });

        } catch (error: any) {
            console.error('Error:', error);
            return res.status(500).json({
                error: error.message || 'Error al procesar el pago'
            });
        }
    }
    //controlador para obtener los clientes con deudas
     async getClientesConMayorDeuda(req: Request, res: Response): Promise<Response> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const clientesConDeuda = await prisma.$queryRaw<any[]>`
        SELECT 
          c.id,
          c.tipo_documento as tipoDocumento,
          c.numero_documento as numeroDocumento,
          c.nombre,
          c.apellido,
          c.razon_social as razonSocial,
          c.telefono,
          c.email,
          c.limite_credito as limiteCredito,
          cc.saldo_actual as saldoActual,
          cc.fecha_proximo_vencimiento as fechaProximoVencimiento,
          cp.nombre as condicionPago,
          cp.dias as diasCredito,
          DATEDIFF(CURDATE(), cc.fecha_proximo_vencimiento) as diasVencido,
          CASE 
            WHEN cc.fecha_proximo_vencimiento < CURDATE() THEN 'vencido'
            WHEN DATEDIFF(cc.fecha_proximo_vencimiento, CURDATE()) <= 7 THEN 'por_vencer'
            ELSE 'vigente'
          END as estadoDeuda
        FROM clientes c
        INNER JOIN cuentas_corrientes cc ON c.id = cc.cliente_id
        LEFT JOIN condiciones_pago cp ON cc.condicion_pago_id = cp.id
        WHERE c.activo = 1
          AND cc.saldo_actual > 0
        ORDER BY cc.saldo_actual DESC
        LIMIT ${limit}
      `;

      // Transformar datos
      const data = clientesConDeuda.map(row => ({
        id: row.id,
        tipoDocumento: row.tipoDocumento,
        numeroDocumento: row.numeroDocumento,
        nombre: row.nombre,
        apellido: row.apellido,
        razonSocial: row.razonSocial,
        nombreCompleto: row.razonSocial || `${row.nombre} ${row.apellido || ''}`.trim(),
        telefono: row.telefono,
        email: row.email,
        limiteCredito: Number(row.limiteCredito),
        saldoActual: Number(row.saldoActual),
        fechaProximoVencimiento: row.fechaProximoVencimiento,
        condicionPago: row.condicionPago,
        diasCredito: Number(row.diasCredito),
        diasVencido: Number(row.diasVencido),
        estadoDeuda: row.estadoDeuda,
        porcentajeCredito: row.limiteCredito > 0 
          ? (Number(row.saldoActual) / Number(row.limiteCredito)) * 100 
          : 0
      }));

      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      console.error('Error al obtener clientes con mayor deuda:', error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener clientes con mayor deuda",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

export const clienteController = new ClienteController();