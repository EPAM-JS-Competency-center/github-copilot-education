import type { Request, Response } from 'express';
import type { AuthUser } from '../services/authService';

type RequestWithAuth = Request & { authUser?: AuthUser };

export const landing = (req: RequestWithAuth, res: Response): void => {
    if (req.authUser) {
        res.redirect('/users');
        return;
    }
    res.render('landing', { authUser: null });
};


