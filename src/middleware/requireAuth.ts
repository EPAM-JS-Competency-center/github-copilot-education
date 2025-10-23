import type { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { verifyJwt } from '../services/authService';
import type { AuthUser } from '../services/authService';

type RequestWithAuth = Request & { authUser?: AuthUser };

export const attachUserFromJwt = (req: Request, _res: Response, next: NextFunction): void => {
    const token = (req as RequestWithAuth).cookies?.auth_token as string | undefined;
    if (!token) {
        return next();
    }
    const user = verifyJwt(token);
    if (user) {
        (req as RequestWithAuth).authUser = user;
    }
    next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as RequestWithAuth).authUser) {
        res.redirect('/');
        return;
    }
    next();
};

export const cookieParserMiddleware = cookieParser();

