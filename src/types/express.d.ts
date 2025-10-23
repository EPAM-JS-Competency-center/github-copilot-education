import type { AuthUser } from '../services/authService';

declare module 'express-serve-static-core' {
    interface Request {
        authUser?: AuthUser;
    }
}

declare module 'express' {
    interface Request {
        authUser?: AuthUser;
    }
}

export {};

