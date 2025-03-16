import { Elysia, t } from 'elysia';

import { authService } from '@/application/services/auth.service';
import { authValidators } from '@/interface/validators/v1/auth-validators';
import { strictRateLimiter } from '@/infrastructure/middleware/rate-limiter';

export const authControllerV1 = new Elysia({ prefix: '/auth' })
    .use(authValidators)
    .use(authService)

    .post('/signup', async ({ body, signUp, error }) => {
        try {
            const user = await signUp(body.email, body.username, body.password, body.useOTP || false);

            return {
                status: 'success',
                message: body.useOTP
                    ? 'User registered successfully. Please check your email for the verification OTP.'
                    : 'User registered successfully. Please check your email for the verification link.',
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


    .post('/verify-otp', async ({ body, verifyEmailWithOTP, error }) => {
        try {
            const user = await verifyEmailWithOTP(body.userId, body.otp);

            return {
                status: 'success',
                message: 'Email verified successfully',
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    verified: user.verified
                }
            };
        } catch (err: any) {
            return error(400, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        body: 'auth.verifyOTP',
        detail: {
            summary: 'Verify email with OTP',
            tags: ['Authentication']
        }
    })


    .post('/request-otp', async ({ body, requestNewOTP, error }) => {
        try {
            const result = await requestNewOTP(body.email);

            if (result.verified) {
                return {
                    status: 'success',
                    message: 'Email is already verified'
                };
            }

            return {
                status: 'success',
                message: 'If the email exists and is not verified, a new OTP has been sent'
            };
        } catch (err: any) {
            return error(400, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        body: 'auth.requestOTP',
        detail: {
            summary: 'Request a new verification OTP',
            tags: ['Authentication']
        }
    })


    .use(strictRateLimiter)
    .post('/request-password-reset', async ({ body, requestPasswordReset, error }) => {
        try {
            await requestPasswordReset(body.email, body.useOTP || false);

            return {
                status: 'success',
                message: body.useOTP
                    ? 'If the email exists, a password reset OTP has been sent'
                    : 'If the email exists, a password reset link has been sent'
            };
        } catch (err: any) {
            return error(400, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        body: 'auth.requestPasswordResetOTP',
        detail: {
            summary: 'Request password reset with OTP option',
            tags: ['Authentication']
        }
    })

    .post('/reset-password-otp', async ({ body, resetPasswordWithOTP, error }) => {

        if (body.password !== body.confirmPassword) {
            return error(400, {
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        try {
            await resetPasswordWithOTP(body.email, body.otp, body.password);

            return {
                status: 'success',
                message: 'Password reset successfully'
            };
        } catch (err: any) {
            return error(400, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        body: 'auth.resetPasswordOTP',
        detail: {
            summary: 'Reset password with OTP',
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
    })

    .get('/verify-email', async ({ query, verifyEmail, error }) => {
        try {
            const user = await verifyEmail(query.token);

            return {
                status: 'success',
                message: 'Email verified successfully',
                data: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    verified: user.verified
                }
            };
        } catch (err: any) {
            return error(400, {
                status: 'error',
                message: err.message
            });
        }
    }, {
        query: t.Object({
            token: t.String()
        }),
        detail: {
            summary: 'Verify email with token',
            tags: ['Authentication']
        }
    })