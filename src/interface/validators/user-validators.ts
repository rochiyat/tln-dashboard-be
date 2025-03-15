import { Elysia, t } from 'elysia';

export const userValidators = new Elysia()
    .model({
        'profile.update': t.Object({
            fullName: t.Optional(t.String()),
            bio: t.Optional(t.String()),
            avatarUrl: t.Optional(t.String()),
            location: t.Optional(t.String()),
            website: t.Optional(t.String())
        }),

        'profile.response': t.Object({
            user: t.Object({
                id: t.String(),
                email: t.String(),
                username: t.String(),
                role: t.String(),
                verified: t.Boolean()
            }),
            profile: t.Object({
                fullName: t.Union([t.String(), t.Null()]),
                bio: t.Union([t.String(), t.Null()]),
                avatarUrl: t.Union([t.String(), t.Null()]),
                location: t.Union([t.String(), t.Null()]),
                website: t.Union([t.String(), t.Null()])
            })
        })
    })
    .as("global")