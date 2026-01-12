import { Express, Router } from 'express';
import usuarioRoutes from './usuario.routes';
import rolRoutes from './rol.routes';
import productoRoutes from './producto.routes';
import ventaRoutes from './venta.routes';
import cajaRoutes from './caja.routes';

export const registerRoutes = (app: Express) => {
    
    const router = Router();

    
    router.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'API is healthy',
            time: new Date().toISOString()
        });
    });

    // Rutas de Usuarios
    router.use('/usuarios', usuarioRoutes);
    router.use('/rols', rolRoutes);
    router.use('/productos', productoRoutes);
    router.use('/ventas', ventaRoutes);
    router.use('/cajas', cajaRoutes);

    app.use('/api/v1', router);
};