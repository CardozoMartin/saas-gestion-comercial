import { usuarioRepository } from "@/repositories/usuario.repository";
import { productoRepository } from "@/repositories/producto.repository";
import { clienteRepository } from "@/repositories/cliente.repository";
import {
  ventaDetalleRepository,
  ventaRepository,
} from "@/repositories/venta.repository";
import { stockRepository } from "@/repositories/stock.repository";
import {
  cajaRepository,
  cajaMovimientoRepository,
} from "@/repositories/caja.repository";
import { prisma } from "@config/database";
import {
  IVenta,
  ICreateVentaInput,
  TipoVenta,
  EstadoVenta,
} from "@/types/venta.types";
import { Decimal } from "@prisma/client/runtime/library";
import { auditoriaRepository } from "@/repositories/auditoria.repository";
import { pagoRepository } from "@/repositories/medio-pago.repository";
import { cajaService } from "./caja.services";

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
    if (data.tipoVenta === TipoVenta.cuenta_corriente && !data.clienteId) {
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
  private async validarCreacionProducto(producto, detalle): Promise<void> {
    if (!producto) {
      throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
    }

    // Validar que esté activo
    if (!producto.activo) {
      throw new Error(`Producto ${producto.nombre} no está activo`);
    }

    // Validar stock disponible
    const stock = await stockRepository.findByProductoId(detalle.productoId);

    if (!stock) {
      throw new Error(
        `No hay registro de stock para el producto ${producto.nombre}`
      );
    }

    const cantidadStock = new Decimal(stock.cantidad.toString());
    const cantidadVenta = new Decimal(detalle.cantidad.toString());

    if (cantidadStock.lessThan(cantidadVenta)) {
      throw new Error(
        `Stock insuficiente para el producto ${
          producto.nombre
        }. Disponible: ${cantidadStock.toString()}, Solicitado: ${cantidadVenta.toString()}`
      );
    }
  }
  // Servicio para crear una venta
  async createVenta(data: ICreateVentaInput, user: any): Promise<IVenta> {
    // 1. Antes de iniciar toda la venta verificamos que exista una caja abierta
    const verifyBoxOpen = await cajaService.obtenerCajaAbierta(data.usuarioId);
    if (!verifyBoxOpen) {
      throw new Error(
        "No tienes una caja abierta. Abre una caja antes de registrar ventas."
      );
    }

    // Validar que existan detalles
    await this.validarCreacionVenta(data);

    // Validar productos y calcular totales
    let subtotal = new Decimal(0);
    const detallesValidados = [];

    for (const detalle of data.detalles) {
      // Validar que el producto exista
      const producto = await productoRepository.findById(detalle.productoId);
      await this.validarCreacionProducto(producto, detalle);

      // Calcular subtotal del detalle
      const subtotalDetalle = new Decimal(detalle.cantidad).times(
        detalle.precioUnitario
      );
      subtotal = subtotal.plus(subtotalDetalle);

      detallesValidados.push({
        productoId: detalle.productoId,
        unidadMedidaId: detalle.unidadMedidaId,
        cantidad: new Decimal(detalle.cantidad),
        precioUnitario: new Decimal(detalle.precioUnitario),
        subtotal: subtotalDetalle,
      });
    }

    // Calcular total con descuento
    const descuento = new Decimal(data.descuento || 0);
    const total = subtotal.minus(descuento);

    if (total.lessThanOrEqualTo(0)) {
      throw new Error("El total de la venta debe ser mayor a 0");
    }

    // 2. Transacción compleja con lógica de negocio
    const venta = await prisma.$transaction(async (tx) => {
      // Generar número de venta
      const numeroVenta = await this.generateNumeroVenta();

      // Crear la venta
      const venta = await ventaRepository.create({
        numeroVenta,
        clienteId: data.clienteId || null,
        usuarioId: data.usuarioId,
        tipoVenta: data.tipoVenta,
        subtotal: subtotal.toNumber(),
        descuento: descuento.toNumber(),
        total: total.toNumber(),
        estado:
          data.tipoVenta === TipoVenta.contado
            ? EstadoVenta.pagada
            : EstadoVenta.pendiente,
        observaciones: data.observaciones || null,
      });

      // Crear los detalles de la venta
      for (const detalle of detallesValidados) {
        await ventaDetalleRepository.create({
          ventaId: venta.id,
          productoId: detalle.productoId,
          unidadMedidaId: detalle.unidadMedidaId,
          cantidad: detalle.cantidad.toNumber(),
          precioUnitario: detalle.precioUnitario.toNumber(),
          subtotal: detalle.subtotal.toNumber(),
        });

        // Actualizar el stock
        const stockActual = await stockRepository.findByProductoId(
          detalle.productoId
        );
        if (stockActual) {
          const nuevaCantidad = new Decimal(stockActual.cantidad).minus(
            detalle.cantidad
          );
          await stockRepository.update(detalle.productoId, {
            cantidad: nuevaCantidad.toNumber(),
          });
        }
      }

      // Registrar el pago si es contado o transferencia inmediata
      if (
        data.tipoVenta === TipoVenta.contado ||
        data.tipoVenta === TipoVenta.transferencia
      ) {
        const medioPagoId = data.tipoVenta === TipoVenta.contado ? 1 : 2;
        const referencia =
          data.tipoVenta === TipoVenta.contado
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

      //Auditoria para dejar registro de la venta creada
      await auditoriaRepository.create({
        usuarioId: user?.id || 1,
        accion: "CREAR_VENTA",
        tablaAfectada: "ventas",
        registroId: venta.id,
        datosNuevos: JSON.stringify(venta),
      });

      return venta;
    });

    // 3. Registrar en caja DESPUÉS de la transacción (para evitar conflictos)
    if (
      data.tipoVenta === TipoVenta.contado ||
      data.tipoVenta === TipoVenta.transferencia
    ) {
      try {
        const cajaAbierta = await cajaRepository.findByUsuarioIdAndEstado(
          data.usuarioId,
          "abierta"
        );

        if (cajaAbierta) {
          const medioPagoId = data.tipoVenta === TipoVenta.contado ? 1 : 2;

          // Obtener el pago recién creado para obtener su ID
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
        } else {
          console.warn(
            `⚠️ Usuario ${data.usuarioId} no tiene caja abierta. Venta ${venta.numeroVenta} no se registró en caja.`
          );
        }
      } catch (error) {
        console.error(`❌ Error al registrar venta en caja:`, error);
        // No lanzamos el error para no afectar la venta ya creada
      }
    }

    return venta;
  }
}

export const ventaService = new VentaService();
