"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.updateUsuarioSchema = exports.createUsuarioSchema = void 0;
const zod_1 = require("zod");
// Esquema para crear usuario
exports.createUsuarioSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellido: zod_1.z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    telefono: zod_1.z.string().optional(),
    rolId: zod_1.z.number().int('El rolId debe ser un número entero'),
});
// Esquema para actualizar usuario
exports.updateUsuarioSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(2).optional(),
    apellido: zod_1.z.string().min(2).optional(),
    telefono: zod_1.z.string().optional(),
    activo: zod_1.z.boolean().optional(),
    rolId: zod_1.z.number().int('El rolId debe ser un número entero').optional(),
});
// Esquema para login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Contraseña inválida'),
});
