"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const logger_1 = require("../config/logger");
const errorHandler = (error, req, res, next) => {
    const err = error;
    logger_1.logger.error(`Error: ${err.message}`);
    // Error de validación Zod
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: error.issues.map(issue => ({
                field: (issue.path || []).join('.'),
                message: issue.message
            }))
        });
    }
    // Error genérico
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
