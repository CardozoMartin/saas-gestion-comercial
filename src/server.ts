import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './config/logger';
import cron from 'node-cron';
import { productoService } from './services/producto.services';

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor
    const server = app.listen(env.PORT, () => {
      logger.info(` Server running on port ${env.PORT}`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` http://localhost:${env.PORT}/api/v1/health`);

      // Producción diaria a las 2:00 AM
      cron.schedule('0 2 * * *', async () => {
        logger.info('\n🏭 ========================================');
        logger.info('   PRODUCCIÓN DIARIA AUTOMÁTICA');
        logger.info(`   📅 ${new Date().toLocaleString()}`);
        logger.info('========================================\n');
        
        try {
          // Pan (3 kilos)
          logger.info('🍞 Actualizando PAN...');
          await productoService.getProductoPorCodigo();
          
          // Tortillas (40 unidades)
          logger.info('🫓 Actualizando TORTILLAS...');
          await productoService.actualizarTortillasDiarias();
          
          // Facturas (15 unidades)
          logger.info('🥐 Actualizando FACTURAS...');
          await productoService.actualizarFacturasDiarias();
          
          logger.info('\n✅ ¡Producción diaria completada exitosamente!');
          
        } catch (error) {
          logger.error('\n❌ Error en producción diaria:', error);
        }
        
       
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