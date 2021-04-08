import { Router, Request, Response } from 'express';

import { verifyToken } from '../middlewares/auth';
import { User } from '../models/user.model';
import Token from '../classes/token';

const bcrypt = require('bcrypt');

const userRoutes = Router();

userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    
    User.findOne({email: body.email}, (err: any, user: any) =>{
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                message: 'Usuario/contraseña no son correctos'
            });
        }

        if (user.comparePassword(body.password)) {
            const token = Token.getJWTToken({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            });
            res.json({
                success: true,
                token: token
            });
        } else {
            return res.json({
                success: false,
                message: 'Usuario/contraseña no son correctos'
            });
        }
    });
})

userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    }

    User.create(user).then(createdUser =>{
        const token = Token.getJWTToken({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            avatar: createdUser.avatar
        });

        res.json({
            success: true,
            token: token
        });
    }).catch(err => {
        res.json({
            success: false,
            err
        });
    });

});

userRoutes.post('/update', verifyToken, (req: any, res: Response) => {

    const user = {
        name: req.body.name || req.user.name,
        avatar: req.body.avatar || req.user.avatar,
        email: req.body.email || req.user.email
    }

    User.findOneAndUpdate({_id: req.user._id}, user, {new: true}, (err, updatedUser: any) => {
        if (err) throw err;

        if (!updatedUser) {
            res.json({
                success: false,
                message: 'No se encuentra el usuario'
            });
        }

        const token = Token.getJWTToken({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar
        });

        res.json({
            success: true,
            token: token
        });
    }).catch(err => {
        res.json({
            success: false,
            err
        });
    });

});

userRoutes.get('/', [verifyToken], (req: any, res: Response) => {
    const user = req.user;

    res.json({
        success: true,
        user
    });
});

export default userRoutes;