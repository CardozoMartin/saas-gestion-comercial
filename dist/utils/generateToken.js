"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarToken = (payload, secret, expiresIn) => {
    const options = {};
    if (expiresIn)
        options.expiresIn = expiresIn;
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generarToken = generarToken;
