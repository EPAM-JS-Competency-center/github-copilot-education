import jwt from 'jsonwebtoken';
import type { Response } from 'express';

export type AuthUser = {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
};

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || '';

const cookieName = 'auth_token';
const cookieMaxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signJwt = (payload: AuthUser): string => {
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not set');
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
};

export const verifyJwt = (token: string): AuthUser | null => {
    if (!jwtSecret) {
        return null;
    }
    try {
        return jwt.verify(token, jwtSecret) as AuthUser;
    } catch {
        return null;
    }
};

export const setAuthCookie = (res: Response, token: string): void => {
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: cookieMaxAgeMs
    });
};

export const clearAuthCookie = (res: Response): void => {
    res.clearCookie(cookieName, { path: '/' });
};

export const getCookieName = (): string => cookieName;
export const getIsProduction = (): boolean => isProduction;

