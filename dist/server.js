"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./config/logger");
const startServer = async () => {
    try {
        // Conectar a la base de datos
        await (0, database_1.connectDatabase)();
        // Iniciar servidor
        const server = app_1.app.listen(env_1.env.PORT, () => {
            logger_1.logger.info(` Server running on port ${env_1.env.PORT}`);
            logger_1.logger.info(` Environment: ${env_1.env.NODE_ENV}`);
            logger_1.logger.info(` http://localhost:${env_1.env.PORT}/api/v1/health`);
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed');
                await (0, database_1.disconnectDatabase)();
                logger_1.logger.info('Database connection closed');
                process.exit(0);
            });
            // Force close after 10s
            setTimeout(() => {
                logger_1.logger.error('Forcing shutdown');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
