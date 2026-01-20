"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteRepository = exports.ClienteRepository = void 0;
const database_1 = require("@config/database");
class ClienteRepository {
    async findAll() {
        return await database_1.prisma.cliente.findMany({
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
    }
    async findById(id) {
        return await database_1.prisma.cliente.findUnique({
            where: { id },
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
                cuentaCorriente: {
                    select: {
                        id: true,
                        saldoActual: true,
                        fechaProximoVencimiento: true,
                    },
                },
            },
        });
    }
    async findByNumeroDocumento(numeroDocumento) {
        return await database_1.prisma.cliente.findFirst({
            where: { numeroDocumento },
        });
    }
    async create(data) {
        return await database_1.prisma.cliente.create({
            data: {
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento,
                nombre: data.nombre,
                apellido: data.apellido || null,
                razonSocial: data.razonSocial || null,
                email: data.email || null,
                telefono: data.telefono || null,
                direccion: data.direccion || null,
                limiteCredito: data.limiteCredito || 0,
                activo: true,
            },
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
    }
    async update(id, data) {
        return await database_1.prisma.cliente.update({
            where: { id },
            data,
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            },
        });
    }
    async delete(id) {
        await database_1.prisma.cliente.delete({
            where: { id },
        });
    }
    //obtendremos la cuenta corriente de un cliente por su id
    //ahora vamos a traer todos los detalles de la cuenta corriente
    async getCuentaCorrientePendienteByClienteId(clienteId) {
        const cuentaCorriente = await database_1.prisma.cuentaCorriente.findFirst({
            where: { clienteId },
            select: {
                id: true,
                saldoActual: true,
                condicionPagoId: true,
                fechaProximoVencimiento: true,
                cliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        razonSocial: true,
                        limiteCredito: true,
                    },
                },
                condicionPago: {
                    select: {
                        nombre: true,
                        dias: true,
                    },
                },
                movimientos: {
                    where: {
                        tipoMovimiento: "cargo",
                    },
                    select: {
                        id: true,
                        monto: true,
                        descripcion: true,
                        fechaMovimiento: true,
                        venta: {
                            select: {
                                id: true,
                                numeroVenta: true,
                                total: true,
                                estado: true,
                                fechaVenta: true,
                                detalles: {
                                    select: {
                                        id: true,
                                        cantidad: true,
                                        precioUnitario: true,
                                        subtotal: true,
                                        producto: {
                                            select: {
                                                id: true,
                                                codigo: true,
                                                nombre: true,
                                            },
                                        },
                                        unidadMedida: {
                                            select: {
                                                abreviatura: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        fechaMovimiento: "desc",
                    },
                },
            },
        });
        return cuentaCorriente;
    }
    // Función separada para ver detalles puntuales de UNA venta específica
    async getDetalleVentaCuentaCorriente(ventaId) {
        return await database_1.prisma.venta.findUnique({
            where: { id: ventaId },
            select: {
                id: true,
                numeroVenta: true,
                subtotal: true,
                descuento: true,
                total: true,
                estado: true,
                fechaVenta: true,
                observaciones: true,
                cliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        razonSocial: true,
                    },
                },
                detalles: {
                    select: {
                        id: true,
                        cantidad: true,
                        precioUnitario: true,
                        subtotal: true,
                        producto: {
                            select: {
                                id: true,
                                codigo: true,
                                nombre: true,
                            },
                        },
                        unidadMedida: {
                            select: {
                                abreviatura: true,
                            },
                        },
                    },
                },
            },
        });
    }
    //metodo para cambiar el estado de un cliente
    async changeStatus(id, activo) {
        return await database_1.prisma.cliente.update({
            where: { id },
            data: { activo },
            select: {
                id: true,
                tipoDocumento: true,
                numeroDocumento: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                email: true,
                telefono: true,
                direccion: true,
                limiteCredito: true,
                activo: true,
                fechaCreacion: true,
                fechaActualizacion: true,
            }
        });
    }
}
exports.ClienteRepository = ClienteRepository;
exports.clienteRepository = new ClienteRepository();
