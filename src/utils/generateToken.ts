import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export const generarToken = (payload: object, secret: Secret, expiresIn?: string | number): string => {
    const options: SignOptions = {};
    if (expiresIn) options.expiresIn = expiresIn as SignOptions['expiresIn'];
    return jwt.sign(payload, secret, options);
}