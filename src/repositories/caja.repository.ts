import { prisma } from '@config/database';
import { ICaja, ICreateCaja, IUpdateCaja, ICajaMovimiento, ICreateCajaMovimiento, IUpdateCajaMovimiento } from '@/types/caja.types';

export class CajaRepository {

    async findAll(): Promise<ICaja[]> {
        return await prisma.caja.findMany({
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async findById(id: number): Promise<ICaja | null> {
        return await prisma.caja.findUnique({
            where: { id },
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async findByUsuarioIdAndEstado(usuarioId: number, estado: string): Promise<ICaja | null> {
        return await prisma.caja.findFirst({
            where: { usuarioId, estado },
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async create(data: ICreateCaja): Promise<ICaja> {
        return await prisma.caja.create({
            data: {
                usuarioId: data.usuarioId,
                montoInicial: data.montoInicial,
                estado: data.estado || 'abierta',
                observaciones: data.observaciones || null
            },
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCaja>): Promise<ICaja> {
        return await prisma.caja.update({
            where: { id },
            data,
            select: {
                id: true,
                usuarioId: true,
                montoInicial: true,
                montoFinal: true,
                totalEfectivo: true,
                totalTransferencias: true,
                totalVentas: true,
                diferencia: true,
                estado: true,
                observaciones: true,
                fechaApertura: true,
                fechaCierre: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.caja.delete({
            where: { id }
        });
    }


async findResumenCajaAbierta(usuarioId: number): Promise<any> {
    const cajaAbierta = await prisma.caja.findFirst({
        where: {
            usuarioId,
            estado: 'abierta'
        },
        select: {
            id: true,
            usuarioId: true,
            montoInicial: true,
            montoFinal: true,
            totalEfectivo: true,
            totalTransferencias: true,
            totalVentas: true,
            diferencia: true,
            estado: true,
            observaciones: true,
            fechaApertura: true,
            fechaCierre: true,
            movimientos: {
                select: {
                    id: true,
                    pagoId: true,
                    tipoMovimiento: true,
                    medioPagoId: true,
                    monto: true,
                    descripcion: true,
                    fechaMovimiento: true,
                    medioPago: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                },
                orderBy: {
                    fechaMovimiento: 'desc'
                }
            }
        }
    });

    if (!cajaAbierta) {
        return null;
    }

    // ✅ NUEVO: Obtener todas las ventas del período de la caja con sus detalles
    const ventas = await prisma.venta.findMany({
        where: {
            usuarioId,
            fechaVenta: {
                gte: cajaAbierta.fechaApertura,
                ...(cajaAbierta.fechaCierre && {
                    lte: cajaAbierta.fechaCierre
                })
            }
        },
        select: {
            id: true,
            numeroVenta: true,
            clienteId: true,
            tipoVenta: true,
            subtotal: true,
            descuento: true,
            total: true,
            estado: true,
            fechaVenta: true,
            cliente: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    razonSocial: true
                }
            },
            detalles: {
                select: {
                    id: true,
                    productoId: true,
                    cantidad: true,
                    precioUnitario: true,
                    subtotal: true,
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            nombre: true,
                            precioCosto: true,
                            precioVenta: true
                        }
                    },
                    unidadMedida: {
                        select: {
                            id: true,
                            nombre: true,
                            abreviatura: true
                        }
                    }
                }
            }
        },
        orderBy: {
            fechaVenta: 'desc'
        }
    });

    // Calcular totales desde los movimientos
    const totalEfectivo = cajaAbierta.movimientos
        .filter(m => m.medioPagoId === 1 && m.tipoMovimiento === 'venta')
        .reduce((sum, m) => sum + Number(m.monto), 0);

    const totalTransferencias = cajaAbierta.movimientos
        .filter(m => m.medioPagoId === 2 && m.tipoMovimiento === 'venta')
        .reduce((sum, m) => sum + Number(m.monto), 0);

    const totalVentas = totalEfectivo + totalTransferencias;
    const montoEsperado = Number(cajaAbierta.montoInicial) + totalVentas;

    // ✅ Calcular totales desde las ventas para verificación
    const totalVentasCalculado = ventas.reduce((sum, v) => sum + Number(v.total), 0);
    const cantidadProductosVendidos = ventas.reduce(
        (sum, v) => sum + v.detalles.reduce((detSum, d) => detSum + Number(d.cantidad), 0), 
        0
    );

    // ✅ Agrupar ventas por tipo
    const ventasPorTipo = {
        contado: ventas.filter(v => v.tipoVenta === 'contado'),
        transferencia: ventas.filter(v => v.tipoVenta === 'transferencia'),
        cuentaCorriente: ventas.filter(v => v.tipoVenta === 'cuenta_corriente')
    };

    return {
        caja: {
            id: cajaAbierta.id,
            usuarioId: cajaAbierta.usuarioId,
            montoInicial: cajaAbierta.montoInicial,
            montoFinal: cajaAbierta.montoFinal,
            totalEfectivo: cajaAbierta.totalEfectivo,
            totalTransferencias: cajaAbierta.totalTransferencias,
            totalVentas: cajaAbierta.totalVentas,
            diferencia: cajaAbierta.diferencia,
            estado: cajaAbierta.estado,
            observaciones: cajaAbierta.observaciones,
            fechaApertura: cajaAbierta.fechaApertura,
            fechaCierre: cajaAbierta.fechaCierre
        },
        movimientos: cajaAbierta.movimientos,
        ventas: ventas,
        resumen: {
            // Totales desde movimientos de caja
            totalEfectivo,
            totalTransferencias,
            totalVentas,
            montoEsperado,
            montoInicial: Number(cajaAbierta.montoInicial),
            cantidadMovimientos: cajaAbierta.movimientos.length,
            
            // ✅ NUEVO: Totales desde ventas (para verificación)
            totalVentasCalculado,
            cantidadVentas: ventas.length,
            cantidadProductosVendidos,
            
            // ✅ NUEVO: Desglose por tipo de venta
            ventasContado: {
                cantidad: ventasPorTipo.contado.length,
                total: ventasPorTipo.contado.reduce((sum, v) => sum + Number(v.total), 0)
            },
            ventasTransferencia: {
                cantidad: ventasPorTipo.transferencia.length,
                total: ventasPorTipo.transferencia.reduce((sum, v) => sum + Number(v.total), 0)
            },
            ventasCuentaCorriente: {
                cantidad: ventasPorTipo.cuentaCorriente.length,
                total: ventasPorTipo.cuentaCorriente.reduce((sum, v) => sum + Number(v.total), 0)
            },
            
            // ✅ NUEVO: Verificación de consistencia
            diferenciaCalculada: totalVentas - totalVentasCalculado
        }
    };
}
}

export class CajaMovimientoRepository {

    async findAll(): Promise<ICajaMovimiento[]> {
        return await prisma.cajaMovimiento.findMany({
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async findById(id: number): Promise<ICajaMovimiento | null> {
        return await prisma.cajaMovimiento.findUnique({
            where: { id },
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async findByCajaId(cajaId: number): Promise<ICajaMovimiento[]> {
        return await prisma.cajaMovimiento.findMany({
            where: { cajaId },
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async create(data: ICreateCajaMovimiento): Promise<ICajaMovimiento> {
        return await prisma.cajaMovimiento.create({
            data: {
                cajaId: data.cajaId,
                pagoId: data.pagoId || null,
                tipoMovimiento: data.tipoMovimiento,
                medioPagoId: data.medioPagoId,
                monto: data.monto,
                descripcion: data.descripcion || null
            },
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async update(id: number, data: Partial<IUpdateCajaMovimiento>): Promise<ICajaMovimiento> {
        return await prisma.cajaMovimiento.update({
            where: { id },
            data,
            select: {
                id: true,
                cajaId: true,
                pagoId: true,
                tipoMovimiento: true,
                medioPagoId: true,
                monto: true,
                descripcion: true,
                fechaMovimiento: true
            }
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.cajaMovimiento.delete({
            where: { id }
        });
    }
}

export const cajaRepository = new CajaRepository();
export const cajaMovimientoRepository = new CajaMovimientoRepository();
