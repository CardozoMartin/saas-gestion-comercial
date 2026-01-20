"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventaService = exports.VentaService = void 0;
const usuario_repository_1 = require("@/repositories/usuario.repository");
const producto_repository_1 = require("@/repositories/producto.repository");
const cliente_repository_1 = require("@/repositories/cliente.repository");
const venta_repository_1 = require("@/repositories/venta.repository");
const stock_repository_1 = require("@/repositories/stock.repository");
const caja_repository_1 = require("@/repositories/caja.repository");
const database_1 = require("@config/database");
const decimal_js_1 = __importDefault(require("decimal.js"));
const auditoria_repository_1 = require("@/repositories/auditoria.repository");
const medio_pago_repository_1 = require("@/repositories/medio-pago.repository");
const caja_services_1 = require("./caja.services");
const UnitConversionService_1 = require("./UnitConversionService");
const unidad_medida_repository_1 = require("@/repositories/unidad-medida.repository");
class VentaService {
    // Generar número de venta único
    async generateNumeroVenta() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        // Buscar el último número de venta del día
        const ultimaVenta = await database_1.prisma.venta.findFirst({
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
    async validarCreacionVenta(data) {
        if (!data.detalles || data.detalles.length === 0) {
            throw new Error("La venta debe tener al menos un detalle");
        }
        // Validar usuario
        const usuario = await usuario_repository_1.usuarioRepository.findById(data.usuarioId);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        // Validar cliente si viene (solo para cuenta corriente es obligatorio)
        if (data.tipoVenta === 'cuenta_corriente' && !data.clienteId) {
            throw new Error("Para ventas en cuenta corriente debe especificar un cliente");
        }
        if (data.clienteId) {
            const cliente = await cliente_repository_1.clienteRepository.findById(data.clienteId);
            if (!cliente) {
                throw new Error("Cliente no encontrado");
            }
        }
    }
    async validarCreacionProducto(producto, detalle) {
        if (!producto) {
            throw new Error(`Producto con ID ${detalle.productoId} no encontrado`);
        }
        if (!producto.activo) {
            throw new Error(`Producto ${producto.nombre} no está activo`);
        }
        // Obtener la unidad de medida del stock (unidad base del producto)
        const unidadBase = await unidad_medida_repository_1.unidadMedidaRepository.findById(producto.unidadMedidaId);
        if (!unidadBase) {
            throw new Error(`Unidad base del producto ${producto.nombre} no encontrada`);
        }
        // Obtener la unidad de medida de la venta
        const unidadVenta = await unidad_medida_repository_1.unidadMedidaRepository.findById(detalle.unidadMedidaId);
        if (!unidadVenta) {
            throw new Error(`Unidad de venta no encontrada`);
        }
        // Validar que las unidades sean compatibles
        const sonCompatibles = UnitConversionService_1.unitConversionService.sonUnidadesCompatibles(unidadBase.abreviatura, unidadVenta.abreviatura);
        if (!sonCompatibles) {
            throw new Error(`Las unidades no son compatibles: ${unidadBase.abreviatura} (stock) vs ${unidadVenta.abreviatura} (venta)`);
        }
        let cantidadParaStock;
        if (unidadBase.abreviatura.toLowerCase() ===
            unidadVenta.abreviatura.toLowerCase()) {
            // Misma unidad, no hay conversión necesaria
            cantidadParaStock = detalle.cantidad;
        }
        else {
            // Diferentes unidades, convertir
            const cantidadConvertida = UnitConversionService_1.unitConversionService.convertir(detalle.cantidad, unidadVenta.abreviatura, unidadBase.abreviatura);
            cantidadParaStock = cantidadConvertida.toNumber();
        }
        // Validar stock
        const stock = await stock_repository_1.stockRepository.findByProductoId(detalle.productoId);
        if (!stock) {
            throw new Error(`No hay registro de stock para el producto ${producto.nombre}`);
        }
        const cantidadStock = new decimal_js_1.default(stock.cantidad.toString());
        const cantidadSolicitada = new decimal_js_1.default(cantidadParaStock);
        if (cantidadStock.lessThan(cantidadSolicitada)) {
            throw new Error(`Stock insuficiente para ${producto.nombre}. ` +
                `Disponible: ${cantidadStock.toNumber()} ${unidadBase.abreviatura}, ` +
                `Solicitado: ${cantidadSolicitada.toNumber()} ${unidadBase.abreviatura} ` +
                `(${detalle.cantidad} ${unidadVenta.abreviatura})`);
        }
        // Retornar la cantidad a descontar del stock
        return {
            producto,
            cantidadEnUnidadBase: cantidadParaStock,
        };
    }
    // Servicio para crear una venta
    async createVenta(data, user) {
        console.log("Creando venta con datos:", data);
        const verifyBoxOpen = await caja_services_1.cajaService.obtenerCajaAbierta(data.usuarioId);
        if (!verifyBoxOpen) {
            console.log("No hay caja abierta para el usuario");
            throw new Error("No tienes una caja abierta. Abre una caja antes de registrar ventas.");
        }
        await this.validarCreacionVenta(data);
        let subtotal = new decimal_js_1.default(0);
        const detallesValidados = [];
        for (const detalle of data.detalles) {
            const producto = await producto_repository_1.productoRepository.findById(detalle.productoId);
            //  Obtener la validación completa
            const validacion = await this.validarCreacionProducto(producto, detalle);
            const subtotalDetalle = new decimal_js_1.default(detalle.cantidad).times(detalle.precioUnitario);
            subtotal = subtotal.plus(subtotalDetalle);
            detallesValidados.push({
                productoId: detalle.productoId,
                unidadMedidaId: detalle.unidadMedidaId,
                cantidad: new decimal_js_1.default(detalle.cantidad), // Cantidad en unidad de venta
                precioUnitario: new decimal_js_1.default(detalle.precioUnitario),
                subtotal: subtotalDetalle,
                cantidadEnUnidadBase: validacion.cantidadEnUnidadBase,
            });
        }
        const descuento = new decimal_js_1.default(data.descuento || 0);
        const total = subtotal.minus(descuento);
        if (total.lessThanOrEqualTo(0)) {
            throw new Error("El total de la venta debe ser mayor a 0");
        }
        const venta = await database_1.prisma.$transaction(async (tx) => {
            const numeroVenta = await this.generateNumeroVenta();
            const venta = await venta_repository_1.ventaRepository.create({
                numeroVenta,
                clienteId: data.clienteId || null,
                usuarioId: data.usuarioId,
                tipoVenta: data.tipoVenta,
                subtotal: subtotal.toNumber(),
                descuento: descuento.toNumber(),
                total: total.toNumber(),
                estado: data.tipoVenta === 'contado'
                    ? 'pagada'
                    : 'pendiente',
                observaciones: data.observaciones || null,
            });
            for (const detalle of detallesValidados) {
                // Crear detalle de venta (con cantidad en unidad de venta)
                await venta_repository_1.ventaDetalleRepository.create({
                    ventaId: venta.id,
                    productoId: detalle.productoId,
                    unidadMedidaId: detalle.unidadMedidaId,
                    cantidad: detalle.cantidad.toNumber(),
                    precioUnitario: detalle.precioUnitario.toNumber(),
                    subtotal: detalle.subtotal.toNumber(),
                });
                //  Actualizar stock (con cantidad en unidad base)
                const stockActual = await stock_repository_1.stockRepository.findByProductoId(detalle.productoId);
                if (stockActual) {
                    const stockAnterior = new decimal_js_1.default(stockActual.cantidad);
                    const cantidadADescontar = new decimal_js_1.default(detalle.cantidadEnUnidadBase);
                    const nuevaCantidad = stockAnterior.minus(cantidadADescontar);
                    await stock_repository_1.stockRepository.update(detalle.productoId, {
                        cantidad: nuevaCantidad.toNumber(),
                    });
                }
            }
            // Registrar pago
            if (data.tipoVenta === 'contado' ||
                data.tipoVenta === 'transferencia') {
                const medioPagoId = data.tipoVenta === 'contado' ? 1 : 2;
                const referencia = data.tipoVenta === 'contado'
                    ? "Pago contado"
                    : "Pago por transferencia";
                await medio_pago_repository_1.pagoRepository.create({
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
                    where: { id: data.clienteId },
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
            await auditoria_repository_1.auditoriaRepository.create({
                usuarioId: user?.id || 1,
                accion: "CREAR_VENTA",
                tablaAfectada: "ventas",
                registroId: venta.id,
                datosNuevos: JSON.stringify(venta),
            });
            return venta;
        });
        // Resto del código de caja...
        if (data.tipoVenta === 'contado' ||
            data.tipoVenta === 'transferencia') {
            try {
                const cajaAbierta = await caja_repository_1.cajaRepository.findByUsuarioIdAndEstado(data.usuarioId, "abierta");
                if (cajaAbierta) {
                    const medioPagoId = data.tipoVenta === 'contado' ? 1 : 2;
                    const pagos = await medio_pago_repository_1.pagoRepository.findByVentaId(venta.id);
                    const pagoId = pagos.length > 0 ? pagos[0].id : null;
                    await caja_repository_1.cajaMovimientoRepository.create({
                        cajaId: cajaAbierta.id,
                        pagoId,
                        tipoMovimiento: "venta",
                        medioPagoId,
                        monto: total.toNumber(),
                        descripcion: `Venta ${venta.numeroVenta}`,
                    });
                }
            }
            catch (error) {
                console.error(`❌ Error al registrar venta en caja:`, error);
            }
        }
        return venta;
    }
}
exports.VentaService = VentaService;
exports.ventaService = new VentaService();
