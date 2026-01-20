// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender la interfaz de Request para incluir user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Middleware para verificar el token
export const loginDataHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verificar el token (no solo decodificarlo)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        console.log('Decoded token data:', decoded);
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware para verificar roles específicos
export const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
      let normalizedUserRole: string;

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
    } catch (error) {
      console.error('Error en checkRole middleware:', error);
      return res.status(500).json({ 
        message: 'Error al verificar permisos',
        error: 'INTERNAL_SERVER_ERROR' 
      });
    }
  };
};

// Middleware alternativo para verificar múltiples roles con lógica OR
export const hasAnyRole = (...roles: string[]) => {
    return checkRole(...roles);
};

// Middleware para verificar que tenga TODOS los roles (lógica AND)
export const hasAllRoles = (...requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Usuario no autenticado',
                    error: 'UNAUTHORIZED'
                });
            }

            const userRoles = req.user.roles || req.user.rol || [];
            const normalizedUserRoles = Array.isArray(userRoles)
                ? userRoles.map((r: any) => typeof r === 'string' ? r.toLowerCase() : r.nombre?.toLowerCase())
                : [typeof userRoles === 'string' ? userRoles.toLowerCase() : userRoles.nombre?.toLowerCase()];

            const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());

            const hasAllPermissions = normalizedRequiredRoles.every(role =>
                normalizedUserRoles.includes(role)
            );

            if (!hasAllPermissions) {
                return res.status(403).json({
                    message: 'No tienes todos los permisos requeridos',
                    error: 'FORBIDDEN',
                    requiredRoles: requiredRoles,
                    userRoles: normalizedUserRoles
                });
            }

            next();
        } catch (error) {
            console.error('Error en hasAllRoles middleware:', error);
            return res.status(500).json({
                message: 'Error al verificar permisos',
                error: 'INTERNAL_SERVER_ERROR'
            });
        }
    };
};

// Middleware solo para admin
export const isAdmin = checkRole('admin');

// Middleware para admin o vendedor
export const isAdminOrVendedor = checkRole('admin', 'vendedor');

// Middleware para admin o cajero
export const isAdminOrCajero = checkRole('admin', 'cajero');



