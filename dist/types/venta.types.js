"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoVenta = exports.TipoVenta = void 0;
var TipoVenta;
(function (TipoVenta) {
    TipoVenta["contado"] = "contado";
    TipoVenta["cuenta_corriente"] = "cuenta_corriente";
    TipoVenta["transferencia"] = "transferencia";
})(TipoVenta || (exports.TipoVenta = TipoVenta = {}));
var EstadoVenta;
(function (EstadoVenta) {
    EstadoVenta["pendiente"] = "pendiente";
    EstadoVenta["pagada"] = "pagada";
    EstadoVenta["cancelada"] = "cancelada";
})(EstadoVenta || (exports.EstadoVenta = EstadoVenta = {}));
