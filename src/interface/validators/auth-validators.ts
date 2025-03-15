import { Elysia, Static, t } from 'elysia';

export const authValidators = new Elysia()
    .model({
        'auth.signup': t.Object({
            email: t.String({ format: 'email', error: 'Please provide a valid email address' }),
            username: t.String({
                minLength: 3,
                maxLength: 20,
                pattern: '^[a-zA-Z0-9_]+$',
                error: 'Username must be between 3 and 20 characters and contain only letters, numbers, and underscores'
            }),
            password: t.String({
                minLength: 8,
                error: 'Password must be at least 8 characters long'
            })
        }),

        'auth.signin': t.Object({
            emailOrUsername: t.String(),
            password: t.String()
        }),

        'auth.response': t.Object({
            user: t.Object({
                id: t.String(),
                email: t.String(),
                username: t.String(),
                role: t.String()
            }),
            token: t.String(),
            expiresAt: t.String()
        }),

        'error': t.Object({
            status: t.Literal('error'),
            message: t.String()
        })
    })
    .as("global")
