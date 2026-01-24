import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './config/logger';
import cron from 'node-cron';
import { productoService } from './services/producto.services';

// Tarea programada: Ejemplo de tarea que se ejecuta cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
  logger.info('Ejecutando tarea programada cada 30 minutos');
  // Aquí puedes agregar la lógica que deseas ejecutar
});

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor
    const server = app.listen(env.PORT, () => {
      logger.info(` Server running on port ${env.PORT}`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` http://localhost:${env.PORT}/api/v1/health`);

      cron.schedule('*/1 * * * *', async () => {
       //para actualizar el pan todo los dias a las 1am
        await productoService.getProductoPorCodigo();
        //para actualizar las tortillas todos los dias a las 1am
        await productoService.actualizarTortillasDiarias()
        //para actualizar las facturas todo los dias a las 1am
        await productoService.actualizarFacturasDiarias()
        
      });
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Database connection closed');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();