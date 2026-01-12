import jwt from 'jsonwebtoken';



export const generarToken = (payload: object, secret: string, expiresIn: string | number): string => {
    return jwt.sign(payload, secret, { expiresIn });
}