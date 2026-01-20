import { prisma } from "@/config/database";
import { clienteRepository } from "@/repositories/cliente.repository";
import {
  ICliente,
  ICreateCliente,
  IUpdateCliente,
} from "@/types/cliente.types";
import { cuentaCorrienteRepository } from "@/repositories/condicion-pago.repository";
import { accountTransactionRepository } from "@/repositories/AccountTransaction";
import { Prisma } from "@prisma/client";
import { cajaRepository } from "@/repositories/caja.repository";
import { de } from "zod/v4/locales";
import { auditoriaRepository } from "@/repositories/auditoria.repository";
interface IPagarCuentaCorriente {
  clienteId: number;
  monto: number;
  medioPagoId: number;
  referencia?: string;
  usuarioId: number;
  observaciones?: string;
}

export class ClienteService {
  constructor() {}

  //funcion para obtener todos los clientes
  async getAllClientes(): Promise<ICliente[]> {
    try {
      const clientes = await clienteRepository.findAll();
      return clientes;
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error}`);
    }
  }
  //funcion para obtener un cliente por id
  async getClienteById(id: number): Promise<ICliente> {
    try {
      const cliente = await clienteRepository.findById(id);
      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }
      return cliente;
    } catch (error) {
      throw error;
    }
  }

  //funcion para crear un cliente
  async createCliente(data: ICreateCliente): Promise<ICliente> {
    try {
      const cliente = await clienteRepository.create(data);

      //ahora vamos a iniciar la cuenta corriente del cliente
      await cuentaCorrienteRepository.create({
        clienteId: cliente.id,
        saldoActual: 0,
        condicionPagoId: data.condicionPagoId,
        fechaProximoVencimiento: data.fechaProximoVencimiento || null,
      });

      //ahora iniciamos la
      return cliente;
    } catch (error) {
      throw error;
    }
  }

  //funcion para actualizar un cliente
  async updateCliente(id: number, data: IUpdateCliente): Promise<ICliente> {
    try {
      const cliente = await clienteRepository.update(id, data);
      return cliente;
    } catch (error) {
      throw error;
    }
  }

  //funcion para eliminar un cliente
  async deleteCliente(id: number): Promise<void> {
    try {
      await clienteRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  //funcion para obtener la cuenta corriente de un cliente
  async getCuentaCorrienteDetalle(clienteId: number): Promise<any> {
    try {
      const cuentaCorriente =
        await clienteRepository.getCuentaCorrientePendienteByClienteId(
          clienteId,
        );

      if (!cuentaCorriente) {
        throw new Error("El cliente no tiene cuenta corriente");
      }

      return cuentaCorriente;
    } catch (error) {
      throw error;
    }
  }
  async getResumenCuentaCorriente(clienteId: number): Promise<any> {
    try {
      const cuentaCorriente =
        await clienteRepository.getCuentaCorrientePendienteByClienteId(
          clienteId,
        );

      if (!cuentaCorriente) {
        throw new Error("El cliente no tiene cuenta corriente");
      }

      const totalDeuda = Number(cuentaCorriente.saldoActual);
      const limiteCredito = Number(cuentaCorriente.cliente.limiteCredito);
      const creditoDisponible = limiteCredito - totalDeuda;

      return {
        cliente: cuentaCorriente.cliente,
        saldoActual: totalDeuda,
        limiteCredito,
        creditoDisponible,
        condicionPago: cuentaCorriente.condicionPago,
        fechaProximoVencimiento: cuentaCorriente.fechaProximoVencimiento,
        ventas: cuentaCorriente.movimientos.map((mov: any) => ({
          numeroVenta: mov.venta.numeroVenta,
          fechaVenta: mov.venta.fechaVenta,
          total: mov.venta.total,
          estado: mov.venta.estado,
          ventaId: mov.venta.id,
          detalles: mov.venta.detalles,

        })),
        resumen: {
          cantidadVentasPendientes: cuentaCorriente.movimientos.length,
          totalDeuda,
          estadoCuenta: totalDeuda > limiteCredito ? "excedido" : "normal",
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Ver detalles de una venta específica
  async getDetalleVenta(ventaId: number): Promise<any> {
    try {
      const venta =
        await clienteRepository.getDetalleVentaCuentaCorriente(ventaId);

      if (!venta) {
        throw new Error("Venta no encontrada");
      }

      return venta;
    } catch (error) {
      throw error;
    }
  }

  //ahora vamos hacer la funcion para hacer el pago de la cuenta corriente de un cliente
  async pagarCuentaCorriente(data: IPagarCuentaCorriente): Promise<any> {
    try {
      // Paso 1: Validar que el cliente existe y tiene cuenta corriente
      const cuentaCorriente = await prisma.cuentaCorriente.findFirst({
        where: { clienteId: data.clienteId },
        include: {
          cliente: true,
        },
      });

      if (!cuentaCorriente) {
        throw new Error("El cliente no tiene cuenta corriente");
      }

      // Paso 2: Validar que el monto sea válido
      const saldoActual = Number(cuentaCorriente.saldoActual);
      if (data.monto <= 0) {
        throw new Error("El monto debe ser mayor a cero");
      }

      if (data.monto > saldoActual) {
        throw new Error(
          `El monto excede la deuda actual (${saldoActual}). ` +
            `Puedes pagar hasta ese monto.`,
        );
      }

      // Paso 3: Verificar que hay una caja abierta
      const cajaAbierta = await cajaRepository.findByUsuarioIdAndEstado(
        data.usuarioId,
        "abierta",
      );

      if (!cajaAbierta) {
        throw new Error("No hay una caja abierta. Debes abrir caja primero.");
      }

      // Paso 4: Iniciar transacción para garantizar consistencia
      const resultado = await prisma.$transaction(async (tx) => {
        // 4.1: Crear el registro de pago
        const pago = await tx.pago.create({
          data: {
            clienteId: data.clienteId,
            ventaId: null, // Es pago general de cuenta corriente
            medioPagoId: data.medioPagoId,
            monto: data.monto,
            referencia: data.referencia || null,
            usuarioId: data.usuarioId,
            observaciones: data.observaciones || "Pago de cuenta corriente",
          },
        });

        // 4.2: Calcular nuevo saldo
        const saldoAnterior = Number(cuentaCorriente.saldoActual);
        const saldoNuevo = saldoAnterior - data.monto;

        // 4.3: Crear movimiento de cuenta corriente
        await tx.movimientoCuentaCorriente.create({
          data: {
            cuentaCorrienteId: cuentaCorriente.id,
            tipoMovimiento: "pago",
            monto: data.monto,
            saldoAnterior: saldoAnterior,
            saldoNuevo: saldoNuevo,
            pagoId: pago.id,
            descripcion: `Pago de cuenta corriente - ${data.observaciones || ""}`,
          },
        });

        // 4.4: Actualizar saldo de cuenta corriente
        await tx.cuentaCorriente.update({
          where: { id: cuentaCorriente.id },
          data: {
            saldoActual: saldoNuevo,
          },
        });

        // 4.5: Registrar movimiento en caja
        await tx.cajaMovimiento.create({
          data: {
            cajaId: cajaAbierta.id,
            pagoId: pago.id,
            tipoMovimiento: "ingreso", // Es un ingreso a caja
            medioPagoId: data.medioPagoId,
            monto: data.monto,
            descripcion: `Pago cuenta corriente - ${cuentaCorriente.cliente.nombre} ${cuentaCorriente.cliente.apellido || ""}`,
          },
        });

        // 4.6: Opcional - Actualizar estado de ventas si se pagó toda la deuda
        if (saldoNuevo === 0) {
          // Obtener todas las ventas pendientes del cliente
          const ventasPendientes = await tx.movimientoCuentaCorriente.findMany({
            where: {
              cuentaCorrienteId: cuentaCorriente.id,
              tipoMovimiento: "cargo",
              venta: {
                estado: "pendiente",
              },
            },
            select: {
              ventaId: true,
            },
          });

          // Marcar ventas como pagadas
          if (ventasPendientes.length > 0) {
            await tx.venta.updateMany({
              where: {
                id: {
                  in: ventasPendientes
                    .map((m) => m.ventaId)
                    .filter((id): id is number => id !== null),
                },
              },
              data: {
                estado: "pagada",
              },
            });
          }

          //auditoria para las ventas pagadas
          for (const ventaMov of ventasPendientes) {
            await auditoriaRepository.create({
              usuarioId: data.usuarioId,
              accion: "Venta pagada automáticamente",
              tablaAfectada: "Venta",
              registroId: ventaMov.ventaId!,
              datosAnteriores: null,
              datosNuevos: JSON.stringify({ estado: "pagada" }),
            });
          }
        }

        return {
          pago,
          saldoAnterior,
          saldoNuevo,
          mensaje:
            saldoNuevo === 0
              ? "Cuenta corriente saldada completamente"
              : `Pago registrado. Saldo restante: ${saldoNuevo}`,
        };
      });

      return resultado;
    } catch (error) {
      console.error("Error al procesar pago:", error);
      throw error;
    }
  }
  async pagarVentasEspecificas(data: {
    clienteId: number;
    ventasAPagar: { ventaId: number; monto: number }[];
    medioPagoId: number;
    referencia?: string;
    usuarioId: number;
  }): Promise<any> {
    try {
      const cuentaCorriente = await prisma.cuentaCorriente.findFirst({
        where: { clienteId: data.clienteId },
      });

      if (!cuentaCorriente) {
        throw new Error("Cliente sin cuenta corriente");
      }

      const cajaAbierta = await cajaRepository.findByUsuarioIdAndEstado(
        data.usuarioId,
        "abierta",
      );

      if (!cajaAbierta) {
        throw new Error("No hay caja abierta");
      }

      const montoTotal = data.ventasAPagar.reduce((sum, v) => sum + v.monto, 0);

      const resultado = await prisma.$transaction(async (tx) => {
        const pagosCreados = [];

        for (const ventaPago of data.ventasAPagar) {
          // Crear pago por cada venta
          const pago = await tx.pago.create({
            data: {
              clienteId: data.clienteId,
              ventaId: ventaPago.ventaId,
              medioPagoId: data.medioPagoId,
              monto: ventaPago.monto,
              referencia: data.referencia || null,
              usuarioId: data.usuarioId,
              observaciones: `Pago venta específica`,
            },
          });

          pagosCreados.push(pago);

          // Verificar si la venta quedó totalmente pagada
          const venta = await tx.venta.findUnique({
            where: { id: ventaPago.ventaId },
            include: { pagos: true },
          });

          if (venta) {
            const totalPagado = venta.pagos.reduce(
              (sum, p) => sum + Number(p.monto),
              0,
            );

            if (totalPagado >= Number(venta.total)) {
              await tx.venta.update({
                where: { id: ventaPago.ventaId },
                data: { estado: "pagada" },
              });
            }
          }
        }

        // Actualizar cuenta corriente
        const saldoAnterior = Number(cuentaCorriente.saldoActual);
        const saldoNuevo = saldoAnterior - montoTotal;

        await tx.movimientoCuentaCorriente.create({
          data: {
            cuentaCorrienteId: cuentaCorriente.id,
            tipoMovimiento: "pago",
            monto: montoTotal,
            saldoAnterior,
            saldoNuevo,
            descripcion: `Pago de ${data.ventasAPagar.length} venta(s)`,
          },
        });

        await tx.cuentaCorriente.update({
          where: { id: cuentaCorriente.id },
          data: { saldoActual: saldoNuevo },
        });

        // Registrar en caja
        await tx.cajaMovimiento.create({
          data: {
            cajaId: cajaAbierta.id,
            pagoId: pagosCreados[0].id,
            tipoMovimiento: "ingreso",
            medioPagoId: data.medioPagoId,
            monto: montoTotal,
            descripcion: `Pago ventas específicas`,
          },
        });

        //registramos el cambio en la auditoria
        await auditoriaRepository.create({
          usuarioId: data.usuarioId,
          accion: "Pago de ventas específicas",
          tablaAfectada: "Pago",
          registroId: pagosCreados[0].id,
          datosAnteriores: null,
          datosNuevos: JSON.stringify(pagosCreados),
        });

        return {
          pagosCreados,
          saldoAnterior,
          saldoNuevo,
          totalPagado: montoTotal,
        };
      });

      return resultado;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  //servicio para cambiar el estado de un cliente
  async changeStatus(id: number, activo: boolean, user?: any): Promise<ICliente> {
    const idCliente = Number(id);
    const cliente = await clienteRepository.findById(idCliente);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }
    const clienteActivo = !cliente.activo;
    const updatedCliente = await clienteRepository.update(idCliente, {
      activo: clienteActivo,
    });

    //auditoria
    await auditoriaRepository.create({
      usuarioId: user?.id || 1,
      accion: clienteActivo ? "Activar cliente" : "Desactivar cliente",
      tablaAfectada: "Cliente",
      registroId: idCliente,
      datosAnteriores: JSON.stringify(cliente),
      datosNuevos: JSON.stringify({ ...cliente, activo: clienteActivo }),
    });
   return updatedCliente;
  }
}

export const clienteService = new ClienteService();
