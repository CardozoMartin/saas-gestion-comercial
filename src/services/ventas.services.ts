import { usuarioRepository } from "../repositories/usuario.repository";
import { productoRepository } from "../repositories/producto.repository";
import { clienteRepository } from "../repositories/cliente.repository";
import {
  ventaDetalleRepository,
  ventaRepository,
} from "../repositories/venta.repository";
import { stockRepository } from "../repositories/stock.repository";
import {
  cajaRepository,
  cajaMovimientoRepository,
} from "../repositories/caja.repository";
import { prisma } from "../config/database";
import {
  IVenta,
  ICreateVentaInput,
  TipoVenta,
  EstadoVenta,
} from "../types/venta.types";
import Decimal from 'decimal.js';
import { auditoriaRepository } from "../repositories/auditoria.repository";
import { pagoRepository } from "../repositories/medio-pago.repository";
import { cajaService } from "./caja.services";
import { unitConversionService } from "./UnitConversionService";
import { unidadMedidaRepository } from "../repositories/unidad-medida.repository";
import { accountTransactionRepository } from "../repositories/AccountTransaction";
import { IUpdateVentaDetallesInput } from "@/types/ventas.types";

export class VentaService {
  // Generar número de venta único
  private async generateNumeroVenta(): Promise<string> {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    // Buscar el último número de venta del día
    const ultimaVenta = await prisma.venta.findFirst({
      where: {
        numeroVenta: {
          startsWith: `V${año}${mes}${dia}`,
        },
      },
      orderBy: {
        numeroVenta: "desc",
      },
    });

    let correlativo = 1;
    if (ultimaVenta) {
      const ultimoCorrelativo = parseInt(ultimaVenta.numeroVenta.slice(-4));
      correlativo = ultimoCorrelativo + 1;
    }

    return `V${año}${mes}${dia}${String(correlativo).padStart(4, "0")}`;
  }
  private async validarCreacionVenta(data: ICreateVentaInput): Promise<void> {
    if (!data.detalles || data.detalles.length === 0) {
      throw new Error("La venta debe tener al menos un detalle");
    }

    // Validar usuario
    const usuario = await usuarioRepository.findById(data.usuarioId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Validar cliente si viene (solo para cuenta corriente es obligatorio)
    if (data.tipoVenta === 'cuenta_corriente' && !data.clienteId) {
      throw new Error(
        "Para ventas en cuenta corriente debe especificar un cliente"
      );
    }

    if (data.clienteId) {
      const cliente = await clienteRepository.findById(data.clienteId);
      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }
    }
  }
  private async validarCreacionProducto(producto: any, detalle: any): Promise<any> {
    if (!producto) {
      throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
    }

    if (!producto.activo) {
      throw new Error(`Producto ${producto.nombre} no está activo`);
    }

    const unidadBase = await unidadMedidaRepository.findById(
      producto.unidadMedidaId
    );

    if (!unidadBase) {
      throw new Error(
        `Unidad base del producto ${producto.nombre} no encontrada`
      );
    }

    const unidadVenta = await unidadMedidaRepository.findById(
      detalle.unidadMedidaId
    );

    if (!unidadVenta) {
      throw new Error(`Unidad de venta no encontrada`);
    }

    // 🔍 LOG: Ver qué unidades estamos comparando
    console.log('📊 VALIDACIÓN DE PRODUCTO:');
    console.log('  - Producto:', producto.nombre);
    console.log('  - Unidad base (stock):', unidadBase.abreviatura);
    console.log('  - Unidad venta:', unidadVenta.abreviatura);
    console.log('  - Cantidad recibida:', detalle.cantidad);

    const sonCompatibles = unitConversionService.sonUnidadesCompatibles(
      unidadBase.abreviatura,
      unidadVenta.abreviatura
    );

    if (!sonCompatibles) {
      throw new Error(
        `Las unidades no son compatibles: ${unidadBase.abreviatura} (stock) vs ${unidadVenta.abreviatura} (venta)`
      );
    }

    let cantidadParaStock: number;

    if (
      unidadBase.abreviatura.toLowerCase() ===
      unidadVenta.abreviatura.toLowerCase()
    ) {
      // Misma unidad, no hay conversión necesaria
      cantidadParaStock = detalle.cantidad;
      console.log('  ✅ Misma unidad, cantidad para stock:', cantidadParaStock);
    } else {
      // Diferentes unidades, convertir
      const cantidadConvertida = unitConversionService.convertir(
        detalle.cantidad,
        unidadVenta.abreviatura,
        unidadBase.abreviatura
      );
      cantidadParaStock = cantidadConvertida.toNumber();
      console.log('  🔄 Conversión necesaria:');
      console.log('    - De:', detalle.cantidad, unidadVenta.abreviatura);
      console.log('    - A:', cantidadParaStock, unidadBase.abreviatura);
    }

    // Validar stock
    const stock = await stockRepository.findByProductoId(detalle.productoId);

    if (!stock) {
      throw new Error(
        `No hay registro de stock para el producto ${producto.nombre}`
      );
    }

    const cantidadStock = new Decimal(stock.cantidad.toString());
    const cantidadSolicitada = new Decimal(cantidadParaStock);

    console.log('  📦 STOCK:');
    console.log('    - Stock disponible:', cantidadStock.toNumber(), unidadBase.abreviatura);
    console.log('    - Cantidad solicitada:', cantidadSolicitada.toNumber(), unidadBase.abreviatura);

    if (cantidadStock.lessThan(cantidadSolicitada)) {
      throw new Error(
        `Stock insuficiente para ${producto.nombre}. ` +
        `Disponible: ${cantidadStock.toNumber()} ${unidadBase.abreviatura}, ` +
        `Solicitado: ${cantidadSolicitada.toNumber()} ${unidadBase.abreviatura} ` +
        `(${detalle.cantidad} ${unidadVenta.abreviatura})`
      );
    }

    console.log('  ✅ Validación exitosa\n');

    return {
      producto,
      cantidadEnUnidadBase: cantidadParaStock,
    };
  }
  // Servicio para crear una venta
  async createVenta(data: ICreateVentaInput, user: any): Promise<IVenta> {
    console.log("Creando venta con datos:", data);
    const verifyBoxOpen = await cajaService.obtenerCajaAbierta(data.usuarioId);
    if (!verifyBoxOpen) {
      console.log("No hay caja abierta para el usuario");
      throw new Error(
        "No tienes una caja abierta. Abre una caja antes de registrar ventas."
      );
    }

    await this.validarCreacionVenta(data);

    let subtotal = new Decimal(0);
    const detallesValidados: any[] = [];
    for (const detalle of data.detalles) {
      const producto = await productoRepository.findById(detalle.productoId);

      //  Obtener la validación completa
      const validacion = await this.validarCreacionProducto(producto, detalle);

      const subtotalDetalle = new Decimal(detalle.cantidad).times(
        detalle.precioUnitario
      );
      subtotal = subtotal.plus(subtotalDetalle);

      detallesValidados.push({
        productoId: detalle.productoId,
        unidadMedidaId: detalle.unidadMedidaId,
        cantidad: new Decimal(detalle.cantidad), // Cantidad en unidad de venta
        precioUnitario: new Decimal(detalle.precioUnitario),
        subtotal: subtotalDetalle,
        cantidadEnUnidadBase: validacion.cantidadEnUnidadBase,
      });
    }

    const descuento = new Decimal(data.descuento || 0);
    const total = subtotal.minus(descuento);

    if (total.lessThanOrEqualTo(0)) {
      throw new Error("El total de la venta debe ser mayor a 0");
    }

    const venta = await prisma.$transaction(async (tx) => {
      const numeroVenta = await this.generateNumeroVenta();

      const venta = await ventaRepository.create({
        numeroVenta,
        clienteId: data.clienteId || null,
        usuarioId: data.usuarioId,
        tipoVenta: data.tipoVenta,
        subtotal: subtotal.toNumber(),
        descuento: descuento.toNumber(),
        total: total.toNumber(),
        estado:
          data.tipoVenta === 'contado'
            ? 'pagada'
            : 'pendiente',
        observaciones: data.observaciones || null,
      });

      for (const detalle of detallesValidados) {
        // Crear detalle de venta (con cantidad en unidad de venta)
        await ventaDetalleRepository.create({
          ventaId: venta.id,
          productoId: detalle.productoId,
          unidadMedidaId: detalle.unidadMedidaId,
          cantidad: detalle.cantidad.toNumber(),
          precioUnitario: detalle.precioUnitario.toNumber(),
          subtotal: detalle.subtotal.toNumber(),
        });

        //  Actualizar stock (con cantidad en unidad base)

        const stockActual = await stockRepository.findByProductoId(
          detalle.productoId
        );

        if (stockActual) {
          const stockAnterior = new Decimal(stockActual.cantidad);
          const cantidadADescontar = new Decimal(detalle.cantidadEnUnidadBase);
          const nuevaCantidad = stockAnterior.minus(cantidadADescontar);

          await stockRepository.update(detalle.productoId, {
            cantidad: nuevaCantidad.toNumber(),
          });
        }
      }

      // Registrar pago
      if (
        data.tipoVenta === 'contado' ||
        data.tipoVenta === 'transferencia'
      ) {
        const medioPagoId = data.tipoVenta === 'contado' ? 1 : 2;
        const referencia =
          data.tipoVenta === 'contado'
            ? "Pago contado"
            : "Pago por transferencia";

        await pagoRepository.create({
          ventaId: venta.id,
          clienteId: data.clienteId || null,
          medioPagoId,
          monto: total.toNumber(),
          usuarioId: data.usuarioId,
          referencia,
          observaciones: null,
        });
      }

      // ✅ MOVER AQUÍ DENTRO DE LA TRANSACCIÓN
      if (data.tipoVenta === 'cuenta_corriente') {
        // ✅ Usar tx en lugar de prisma directamente
        const cliente = await tx.cliente.findUnique({
          where: { id: data.clienteId! },
          select: {
            id: true,
            cuentaCorriente: {
              select: {
                id: true,
                saldoActual: true,
              }
            }
          }
        });

        console.log("Cliente para cuenta corriente:", cliente);

        if (!cliente || !cliente.cuentaCorriente) {
          throw new Error("Cliente no tiene cuenta corriente configurada");
        }

        const saldoAnterior = Number(cliente.cuentaCorriente.saldoActual);
        console.log("🚀 saldoAnterior:", saldoAnterior);

        const saldoNuevo = saldoAnterior + total.toNumber();
        console.log("🚀 saldoNuevo:", saldoNuevo);

        // Crear el movimiento
        await tx.movimientoCuentaCorriente.create({
          data: {
            cuentaCorrienteId: cliente.cuentaCorriente.id,
            tipoMovimiento: "cargo",
            monto: total.toNumber(),
            saldoAnterior: saldoAnterior,
            saldoNuevo: saldoNuevo,
            ventaId: venta.id,
            pagoId: null,
            descripcion: `Venta ${venta.numeroVenta}`,
            fechaMovimiento: new Date(),
          }
        });

        // ✅ IMPORTANTE: Actualizar el saldo actual de la cuenta corriente
        await tx.cuentaCorriente.update({
          where: { id: cliente.cuentaCorriente.id },
          data: {
            saldoActual: saldoNuevo
          }
        });
      }

      await auditoriaRepository.create({
        usuarioId: user?.id || 1,
        accion: "CREAR_VENTA",
        tablaAfectada: "ventas",
        registroId: venta.id,
        datosNuevos: JSON.stringify(venta),
      });

      return venta;
    });

    // Resto del código de caja...
    if (
      data.tipoVenta === 'contado' ||
      data.tipoVenta === 'transferencia'
    ) {
      try {
        const cajaAbierta = await cajaRepository.findByUsuarioIdAndEstado(
          data.usuarioId,
          "abierta"
        );

        if (cajaAbierta) {
          const medioPagoId = data.tipoVenta === 'contado' ? 1 : 2;
          const pagos = await pagoRepository.findByVentaId(venta.id);
          const pagoId = pagos.length > 0 ? pagos[0].id : null;

          await cajaMovimientoRepository.create({
            cajaId: cajaAbierta.id,
            pagoId,
            tipoMovimiento: "venta",
            medioPagoId,
            monto: total.toNumber(),
            descripcion: `Venta ${venta.numeroVenta}`,
          });
        }
      } catch (error) {
        console.error(`❌ Error al registrar venta en caja:`, error);
      }
    }

    return venta;
  }
  async updateVentaDetalles(
    ventaId: number,
    data: IUpdateVentaDetallesInput,
    user: any
  ): Promise<IVenta> {
    console.log("🔄 Actualizando venta ID:", ventaId);

    // 1. Validar que la venta existe
    const ventaExistente = await ventaRepository.findById(ventaId);
    if (!ventaExistente) {
      throw new Error("Venta no encontrada");
    }

    // 2. Validar que la venta no esté cancelada (anulada)
    if (ventaExistente.estado === 'cancelada') {
      throw new Error("No se puede editar una venta anulada");
    }

    // 3. Obtener detalles actuales
    const detallesActuales = await ventaDetalleRepository.findByVentaId(ventaId);

    return await prisma.$transaction(async (tx) => {
      // 4. Guardar datos originales para auditoría
      const datosOriginales = {
        venta: ventaExistente,
        detalles: detallesActuales
      };

      // 5. Revertir stock de detalles actuales
      for (const detalle of detallesActuales) {
        const producto = await productoRepository.findById(detalle.productoId);
        const unidadBase = await unidadMedidaRepository.findById(producto!.unidadMedidaId);
        const unidadVenta = await unidadMedidaRepository.findById(detalle.unidadMedidaId);

        let cantidadParaStock: number;
        if (unidadBase!.abreviatura.toLowerCase() === unidadVenta!.abreviatura.toLowerCase()) {
          cantidadParaStock = detalle.cantidad;
        } else {
          cantidadParaStock = unitConversionService.convertir(
            detalle.cantidad,
            unidadVenta!.abreviatura,
            unidadBase!.abreviatura
          ).toNumber();
        }

        // Devolver al stock
        const stockActual = await stockRepository.findByProductoId(detalle.productoId);
        if (stockActual) {
          await stockRepository.update(detalle.productoId, {
            cantidad: new Decimal(stockActual.cantidad).plus(cantidadParaStock).toNumber()
          });
        }

        // Eliminar detalle actual
        await tx.ventaDetalle.delete({
          where: { id: detalle.id }
        });
      }

      // 6. Procesar nuevos detalles
      let nuevoSubtotal = new Decimal(0);
      const nuevosDetallesValidados: any[] = [];

      for (const detalle of data.detalles) {
        const producto = await productoRepository.findById(detalle.productoId);
        const validacion = await this.validarCreacionProducto(producto, detalle);

        const subtotalDetalle = new Decimal(detalle.cantidad).times(detalle.precioUnitario);
        nuevoSubtotal = nuevoSubtotal.plus(subtotalDetalle);

        nuevosDetallesValidados.push({
          productoId: detalle.productoId,
          unidadMedidaId: detalle.unidadMedidaId,
          cantidad: new Decimal(detalle.cantidad),
          precioUnitario: new Decimal(detalle.precioUnitario),
          subtotal: subtotalDetalle,
          cantidadEnUnidadBase: validacion.cantidadEnUnidadBase,
        });
      }

      // 7. Calcular nuevo total
      const nuevoDescuento = new Decimal(ventaExistente.descuento);
      const nuevoTotal = nuevoSubtotal.minus(nuevoDescuento);

      if (nuevoTotal.lessThanOrEqualTo(0)) {
        throw new Error("El total de la venta debe ser mayor a 0");
      }

      // 8. Marcar como editada en observaciones
      const fechaEdicion = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires'
      });
      const marcaEdicion = `[EDITADA: ${fechaEdicion} por usuario ID:${user?.id || 'desconocido'}]`;
      const observacionesOriginales = ventaExistente.observaciones || '';
      const nuevasObservaciones = data.observaciones
        ? `${marcaEdicion} ${data.observaciones}\n---ORIGINAL---\n${observacionesOriginales}`
        : `${marcaEdicion}\n---ORIGINAL---\n${observacionesOriginales}`;

      // 9. Actualizar venta (mantener estado original si era pagada/pendiente)
      const ventaActualizada = await tx.venta.update({
        where: { id: ventaId },
        data: {
          subtotal: nuevoSubtotal.toNumber(),
          total: nuevoTotal.toNumber(),
          observaciones: nuevasObservaciones,
          // NO cambiamos el estado, lo mantenemos
        }
      });

      // 10. Crear nuevos detalles
      for (const detalle of nuevosDetallesValidados) {
        await tx.ventaDetalle.create({
          data: {
            ventaId: ventaId,
            productoId: detalle.productoId,
            unidadMedidaId: detalle.unidadMedidaId,
            cantidad: detalle.cantidad.toNumber(),
            precioUnitario: detalle.precioUnitario.toNumber(),
            subtotal: detalle.subtotal.toNumber(),
          }
        });

        // Descontar del stock
        const stockActual = await stockRepository.findByProductoId(detalle.productoId);
        if (stockActual) {
          await stockRepository.update(detalle.productoId, {
            cantidad: new Decimal(stockActual.cantidad).minus(detalle.cantidadEnUnidadBase).toNumber()
          });
        }
      }

      // 11. Si es cuenta corriente, ajustar movimiento
      if (ventaExistente.tipoVenta === 'cuenta_corriente' && ventaExistente.clienteId) {
        const cliente = await tx.cliente.findUnique({
          where: { id: ventaExistente.clienteId },
          select: {
            cuentaCorriente: {
              select: {
                id: true,
                saldoActual: true,
              }
            }
          }
        });

        if (cliente?.cuentaCorriente) {
          // Eliminar movimiento anterior
          await tx.movimientoCuentaCorriente.deleteMany({
            where: { ventaId: ventaId }
          });

          // Recalcular saldo
          const diferencia = nuevoTotal.toNumber() - ventaExistente.total;
          const saldoAnterior = Number(cliente.cuentaCorriente.saldoActual);
          const saldoNuevo = saldoAnterior + diferencia;

          // Crear nuevo movimiento
          await tx.movimientoCuentaCorriente.create({
            data: {
              cuentaCorrienteId: cliente.cuentaCorriente.id,
              tipoMovimiento: "cargo",
              monto: nuevoTotal.toNumber(),
              saldoAnterior: saldoAnterior - ventaExistente.total,
              saldoNuevo: saldoNuevo,
              ventaId: ventaId,
              descripcion: `Venta ${ventaExistente.numeroVenta} (Editada el ${fechaEdicion})`,
              fechaMovimiento: new Date(),
            }
          });

          // Actualizar saldo de cuenta corriente
          await tx.cuentaCorriente.update({
            where: { id: cliente.cuentaCorriente.id },
            data: { saldoActual: saldoNuevo }
          });
        }
      }

      // 12. Registrar auditoría
      await auditoriaRepository.create({
        usuarioId: user?.id || 1,
        accion: "EDITAR_VENTA",
        tablaAfectada: "ventas",
        registroId: ventaId,
        datosAnteriores: JSON.stringify(datosOriginales),
        datosNuevos: JSON.stringify({
          venta: ventaActualizada,
          detalles: nuevosDetallesValidados
        }),
      });

      return ventaActualizada;
    });
  }


  async anularVenta(ventaId: number, motivoAnulacion: string, user: any): Promise<IVenta> {
    console.log("❌ Anulando venta ID:", ventaId);

    if (!motivoAnulacion || motivoAnulacion.trim() === '') {
      throw new Error("Debe proporcionar un motivo de anulación");
    }

    // 1. Validar que la venta existe
    const ventaExistente = await ventaRepository.findById(ventaId);
    if (!ventaExistente) {
      throw new Error("Venta no encontrada");
    }

    // 2. Validar que la venta no esté ya cancelada
    if (ventaExistente.estado === 'cancelada') {
      throw new Error("La venta ya está anulada");
    }

    // 3. Obtener detalles de la venta
    const detalles = await ventaDetalleRepository.findByVentaId(ventaId);

    return await prisma.$transaction(async (tx) => {
      // 4. Revertir stock
      console.log('📦 Revirtiendo stock de', detalles.length, 'productos...');

      for (const detalle of detalles) {
        const producto = await productoRepository.findById(detalle.productoId);
        const unidadBase = await unidadMedidaRepository.findById(producto!.unidadMedidaId);
        const unidadVenta = await unidadMedidaRepository.findById(detalle.unidadMedidaId);

        let cantidadParaStock: number;
        if (unidadBase!.abreviatura.toLowerCase() === unidadVenta!.abreviatura.toLowerCase()) {
          cantidadParaStock = detalle.cantidad;
        } else {
          cantidadParaStock = unitConversionService.convertir(
            detalle.cantidad,
            unidadVenta!.abreviatura,
            unidadBase!.abreviatura
          ).toNumber();
        }

        // Devolver al stock
        const stockActual = await stockRepository.findByProductoId(detalle.productoId);
        if (stockActual) {
          const nuevoStock = new Decimal(stockActual.cantidad).plus(cantidadParaStock).toNumber();
          await stockRepository.update(detalle.productoId, {
            cantidad: nuevoStock
          });
          console.log(`  ✅ ${producto!.nombre}: devuelto ${cantidadParaStock} ${unidadBase!.abreviatura} (nuevo stock: ${nuevoStock})`);
        }
      }

      // 5. Si es cuenta corriente, revertir movimiento
      if (ventaExistente.tipoVenta === 'cuenta_corriente' && ventaExistente.clienteId) {
        const cliente = await tx.cliente.findUnique({
          where: { id: ventaExistente.clienteId },
          select: {
            cuentaCorriente: {
              select: {
                id: true,
                saldoActual: true,
              }
            }
          }
        });

        if (cliente?.cuentaCorriente) {
          const saldoAnterior = Number(cliente.cuentaCorriente.saldoActual);
          const saldoNuevo = saldoAnterior - ventaExistente.total;

          // Crear movimiento de anulación
          await tx.movimientoCuentaCorriente.create({
            data: {
              cuentaCorrienteId: cliente.cuentaCorriente.id,
              tipoMovimiento: "pago", // Se registra como "pago" porque reduce la deuda
              monto: ventaExistente.total,
              saldoAnterior: saldoAnterior,
              saldoNuevo: saldoNuevo,
              ventaId: ventaId,
              descripcion: `ANULACIÓN - Venta ${ventaExistente.numeroVenta}: ${motivoAnulacion}`,
              fechaMovimiento: new Date(),
            }
          });

          // Actualizar saldo
          await tx.cuentaCorriente.update({
            where: { id: cliente.cuentaCorriente.id },
            data: { saldoActual: saldoNuevo }
          });

          console.log(`  💳 Cuenta corriente ajustada: $${saldoAnterior} → $${saldoNuevo}`);
        }
      }

      // 6. Marcar pagos como anulados (actualizar observaciones)
      const pagos = await tx.pago.findMany({
        where: { ventaId: ventaId }
      });

      for (const pago of pagos) {
        await tx.pago.update({
          where: { id: pago.id },
          data: {
            observaciones: `[ANULADO] ${motivoAnulacion}. Original: ${pago.observaciones || 'sin observaciones'}`
          }
        });
      }

      // 7. Marcar movimientos de caja (actualizar descripción)
      const movimientosCaja = await tx.cajaMovimiento.findMany({
        where: {
          pagoId: { in: pagos.map(p => p.id) }
        }
      });

      for (const mov of movimientosCaja) {
        await tx.cajaMovimiento.update({
          where: { id: mov.id },
          data: {
            descripcion: `[ANULADO] ${mov.descripcion}`
          }
        });
      }

      // 8. Actualizar estado de la venta a 'cancelada' y agregar marca
      const fechaAnulacion = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires'
      });
      const marcaAnulacion = `[ANULADA: ${fechaAnulacion} por usuario ID:${user?.id || 'desconocido'}]\nMotivo: ${motivoAnulacion}`;
      const observacionesOriginales = ventaExistente.observaciones || '';

      const ventaAnulada = await tx.venta.update({
        where: { id: ventaId },
        data: {
          estado: 'cancelada', // ✅ Usar el estado existente en la BD
          observaciones: `${marcaAnulacion}\n---ORIGINAL---\n${observacionesOriginales}`
        }
      });

      // 9. Registrar auditoría
      await auditoriaRepository.create({
        usuarioId: user?.id || 1,
        accion: "ANULAR_VENTA",
        tablaAfectada: "ventas",
        registroId: ventaId,
        datosAnteriores: JSON.stringify(ventaExistente),
        datosNuevos: JSON.stringify({
          ...ventaAnulada,
          motivoAnulacion
        }),
      });

      console.log('✅ Venta anulada exitosamente');
      return ventaAnulada;
    });
  }

  
    //Obtener todas las ventas
   
  async getAllVentas(): Promise<IVenta[]> {
    return await ventaRepository.findAll();
  }


   // Obtener venta por ID con detalles
  
  async getVentaById(ventaId: number): Promise<any> {
    const venta = await ventaRepository.findById(ventaId);
    if (!venta) return null;

    const detalles = await ventaDetalleRepository.findByVentaId(ventaId);

    // Determinar el estado real de la venta
    let estadoReal = venta.estado;
    let fueEditada = false;
    let fueAnulada = false;

    if (venta.observaciones) {
      if (venta.observaciones.includes('[EDITADA:')) {
        fueEditada = true;
      }
      if (venta.observaciones.includes('[ANULADA:')) {
        fueAnulada = true;
      }
    }

    return {
      ...venta,
      detalles,
      meta: {
        fueEditada,
        fueAnulada,
        estadoReal: fueAnulada ? 'anulada' : fueEditada ? 'editada' : estadoReal
      }
    };
  }

  //funcion para ob
}

export const ventaService = new VentaService();
