import { Request, Response, NextFunction } from 'express';
import Token from '../classes/token';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.get('x-token') || '';

    Token.tokenControl(token).then((decoded: any) => {
        req.user = decoded.user;
        next();
    }).catch(err => {
        res.json({
            success: false,
            message: 'El token no es valido'
        })
    });

}
