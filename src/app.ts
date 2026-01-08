import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { notFound } from './middlewares/notFound.middleware';
import { logger } from './config/logger';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas peticiones desde esta IP'
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', limiter);

// Logger de requests
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Routes
registerRoutes(app);

// 404 handler
app.use(notFound);

// Error handler (debe ir al final)
app.use(errorHandler);

export { app };