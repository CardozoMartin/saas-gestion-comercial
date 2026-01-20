"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrCajero = exports.isAdminOrVendedor = exports.isAdmin = exports.hasAllRoles = exports.hasAnyRole = exports.checkRole = exports.loginDataHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware para verificar el token
const loginDataHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Verificar el token (no solo decodificarlo)
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        console.log('Decoded token data:', decoded);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginDataHandler = loginDataHandler;
// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Verificar que el usuario esté autenticado
            if (!req.user) {
                return res.status(401).json({
                    message: 'Usuario no autenticado',
                    error: 'UNAUTHORIZED'
                });
            }
            // Obtener el rol del usuario del token (soporta múltiples formatos)
            const userRoles = req.user.roles || req.user.rol || req.user.role;
            console.log('User roles from token:', userRoles); // Debug
            // Si el usuario no tiene rol
            if (!userRoles) {
                return res.status(403).json({
                    message: 'Usuario sin rol asignado',
                    error: 'NO_ROLE'
                });
            }
            // Normalizar a minúsculas para comparación
            let normalizedUserRole;
            // Caso 1: Array de objetos [{id, nombre, descripcion}]
            if (Array.isArray(userRoles) && userRoles.length > 0) {
                normalizedUserRole = userRoles[0].nombre?.toLowerCase();
            }
            // Caso 2: String simple
            else if (typeof userRoles === 'string') {
                normalizedUserRole = userRoles.toLowerCase();
            }
            // Caso 3: Objeto {id, nombre, descripcion}
            else if (typeof userRoles === 'object' && userRoles.nombre) {
                normalizedUserRole = userRoles.nombre.toLowerCase();
            }
            // No se pudo determinar el rol
            else {
                return res.status(403).json({
                    message: 'Formato de rol no válido',
                    error: 'INVALID_ROLE_FORMAT',
                    receivedRoles: userRoles
                });
            }
            const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
            console.log('Normalized user role:', normalizedUserRole); // Debug
            console.log('Allowed roles:', normalizedAllowedRoles); // Debug
            // Verificar si el rol del usuario está en los roles permitidos
            const hasPermission = normalizedAllowedRoles.includes(normalizedUserRole);
            if (!hasPermission) {
                return res.status(403).json({
                    message: 'No tienes permisos para acceder a este recurso',
                    error: 'FORBIDDEN',
                    requiredRoles: allowedRoles,
                    userRole: normalizedUserRole
                });
            }
            // Si tiene permiso, continuar
            next();
        }
        catch (error) {
            console.error('Error en checkRole middleware:', error);
            return res.status(500).json({
                message: 'Error al verificar permisos',
                error: 'INTERNAL_SERVER_ERROR'
            });
        }
    };
};
exports.checkRole = checkRole;
// Middleware alternativo para verificar múltiples roles con lógica OR
const hasAnyRole = (...roles) => {
    return (0, exports.checkRole)(...roles);
};
exports.hasAnyRole = hasAnyRole;
// Middleware para verificar que tenga TODOS los roles (lógica AND)
const hasAllRoles = (...requiredRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Usuario no autenticado',
                    error: 'UNAUTHORIZED'
                });
            }
            const userRoles = req.user.roles || req.user.rol || [];
            const normalizedUserRoles = Array.isArray(userRoles)
                ? userRoles.map((r) => typeof r === 'string' ? r.toLowerCase() : r.nombre?.toLowerCase())
                : [typeof userRoles === 'string' ? userRoles.toLowerCase() : userRoles.nombre?.toLowerCase()];
            const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());
            const hasAllPermissions = normalizedRequiredRoles.every(role => normalizedUserRoles.includes(role));
            if (!hasAllPermissions) {
                return res.status(403).json({
                    message: 'No tienes todos los permisos requeridos',
                    error: 'FORBIDDEN',
                    requiredRoles: requiredRoles,
                    userRoles: normalizedUserRoles
                });
            }
            next();
        }
        catch (error) {
            console.error('Error en hasAllRoles middleware:', error);
            return res.status(500).json({
                message: 'Error al verificar permisos',
                error: 'INTERNAL_SERVER_ERROR'
            });
        }
    };
};
exports.hasAllRoles = hasAllRoles;
// Middleware solo para admin
exports.isAdmin = (0, exports.checkRole)('admin');
// Middleware para admin o vendedor
exports.isAdminOrVendedor = (0, exports.checkRole)('admin', 'vendedor');
// Middleware para admin o cajero
exports.isAdminOrCajero = (0, exports.checkRole)('admin', 'cajero');
