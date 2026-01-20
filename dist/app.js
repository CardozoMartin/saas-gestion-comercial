"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = require("./routes");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const logger_1 = require("./config/logger");
const app = (0, express_1.default)();
exports.app = app;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: 'Demasiadas peticiones desde esta IP'
});
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/api', limiter);
// Logger de requests
app.use((req, res, next) => {
    logger_1.logger.http(`${req.method} ${req.url}`);
    next();
});
// Routes
(0, routes_1.registerRoutes)(app);
// 404 handler
app.use(notFound_middleware_1.notFound);
// Error handler (debe ir al final)
app.use(errorHandler_middleware_1.errorHandler);
