"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoMovimientoCaja = exports.EstadoCaja = void 0;
var EstadoCaja;
(function (EstadoCaja) {
    EstadoCaja["abierta"] = "abierta";
    EstadoCaja["cerrada"] = "cerrada";
})(EstadoCaja || (exports.EstadoCaja = EstadoCaja = {}));
var TipoMovimientoCaja;
(function (TipoMovimientoCaja) {
    TipoMovimientoCaja["venta"] = "venta";
    TipoMovimientoCaja["retiro"] = "retiro";
    TipoMovimientoCaja["ingreso"] = "ingreso";
})(TipoMovimientoCaja || (exports.TipoMovimientoCaja = TipoMovimientoCaja = {}));
