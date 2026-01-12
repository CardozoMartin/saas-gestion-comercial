
//middleware para ver si existe el token de login y obtener los datos del usuario
import { Request, Response, NextFunction } from 'express';
import jwt,{decode} from 'jsonwebtoken';


export const loginDataHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}