import { Express, Router } from 'express';
import usuarioRoutes from './usuario.routes';
import rolRoutes from './rol.routes';


export const registerRoutes = (app: Express) => {
    // Router base para /api/v1
    const router = Router();

    // Health check
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

    app.use('/api/v1', router);
};