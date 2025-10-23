import type { Express, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { clearAuthCookie, setAuthCookie, signJwt } from '../services/authService';

const OAUTH_STATE_COOKIE = 'oauth_state';
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

const getEnv = (key: string): string => {
    const val = process.env[key];
    if (!val) throw new Error(`${key} is not set`);
    return val;
};

const buildOauthClient = (): OAuth2Client => {
    const clientId = getEnv('GOOGLE_CLIENT_ID');
    const clientSecret = getEnv('GOOGLE_CLIENT_SECRET');
    const redirectUri = getEnv('GOOGLE_REDIRECT_URI');
    return new OAuth2Client({ clientId, clientSecret, redirectUri });
};

const generateState = (): { value: string; sig: string } => {
    const value = crypto.randomUUID();
    const secret = getEnv('JWT_SECRET');
    const sig = crypto.createHmac('sha256', secret).update(value).digest('hex');
    return { value, sig };
};

const verifyState = (value: string, sig: string): boolean => {
    const secret = getEnv('JWT_SECRET');
    const expected = crypto.createHmac('sha256', secret).update(value).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
};

export const setAuthRoutes = (app: Express): void => {
    app.get('/auth/google', (req: Request, res: Response) => {
        const client = buildOauthClient();
        const { value, sig } = generateState();
        res.cookie(OAUTH_STATE_COOKIE, `${value}.${sig}`, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: OAUTH_STATE_MAX_AGE_MS,
            path: '/'
        });
        const url = client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['openid', 'email', 'profile'],
            state: value
        });
        res.redirect(url);
    });

    app.get('/auth/google/callback', async (req: Request, res: Response) => {
        const client = buildOauthClient();
        const code = req.query.code as string | undefined;
        const returnedState = req.query.state as string | undefined;
        const cookie = req.cookies?.[OAUTH_STATE_COOKIE] as string | undefined;

        if (!code || !returnedState || !cookie) {
            res.status(400).send('Invalid OAuth callback');
            return;
        }
        const [cookieState, sig] = cookie.split('.');
        if (!cookieState || !sig || cookieState !== returnedState || !verifyState(cookieState, sig)) {
            res.status(400).send('Invalid state');
            return;
        }

        try {
            const redirectUri = getEnv('GOOGLE_REDIRECT_URI');
            const { tokens } = await client.getToken({ code, redirect_uri: redirectUri });
            const idToken = tokens.id_token;
            if (!idToken) {
                res.status(400).send('No id_token returned');
                return;
            }
            const ticket = await client.verifyIdToken({ idToken, audience: getEnv('GOOGLE_CLIENT_ID') });
            const payload = ticket.getPayload();
            if (!payload || !payload.sub || !payload.email) {
                res.status(400).send('Invalid id_token payload');
                return;
            }
            const { sub, email, name, picture } = payload;
            const jwt = signJwt({ sub, email, name, picture });
            setAuthCookie(res, jwt);
            res.clearCookie(OAUTH_STATE_COOKIE, { path: '/' });
            res.redirect('/');
        } catch (err) {
            res.status(500).send('Authentication failed');
        }
    });

    app.post('/auth/logout', (req: Request, res: Response) => {
        clearAuthCookie(res);
        res.redirect('/');
    });
};


