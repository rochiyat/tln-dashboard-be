import { Elysia, t } from 'elysia';

import { authService } from '@/application/services/auth.service';
import { authValidators } from '../validators/auth-validators';

export const authController = new Elysia({ prefix: '/auth' })
    .use(authValidators)
    .use(authService)

    .post('/signup', async ({ body, signUp, error }) => {
        try {
            const user = await signUp(body.email, body.username, body.password);

            return {
                status: 'success',
                message: 'User registered successfully',
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            };
        } catch (err: any) {
            return error(400, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        body: 'auth.signup',
        detail: {
            summary: 'Register a new user',
            tags: ['Authentication']
        }
    })

    .post('/signin', async ({ body, signIn, cookie, error }) => {
        try {
            const result = await signIn(body.emailOrUsername, body.password);

            cookie.auth_token.set({
                value: result.token,
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60,
                path: '/'
            });

            return {
                status: 'success',
                message: 'Signed in successfully',
                data: result
            };
        } catch (err: any) {
            return error(401, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        body: 'auth.signin',
        detail: {
            summary: 'Sign in user',
            tags: ['Authentication']
        }
    })

    .post('/signout', ({ cookie }) => {
        cookie.auth_token.remove();

        return {
            status: 'success',
            message: 'Signed out successfully'
        };
    }, {
        detail: {
            summary: 'Sign out user',
            tags: ['Authentication']
        }
    });