import { hashPassword, verifyPassword } from '../../infrastructure/utils/password';

import { DrizzleUserRepository } from '../../infrastructure/database/repositories/user-repository';
import { Elysia } from 'elysia';
import { createId } from '@paralleldrive/cuid2';
import { jwt } from '@elysiajs/jwt';

export const authService = new Elysia({ name: 'Service.Auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
            exp: process.env.JWT_EXPIRES_IN || '7d'
        })
    )
    .state('userRepository', new DrizzleUserRepository())
    .derive(({ jwt, store }) => ({
        async signUp(email: string, username: string, password: string) {
            const userRepository = store.userRepository;

            const existingByEmail = await userRepository.findByEmail(email);
            if (existingByEmail) {
                throw new Error('Email already in use');
            }

            const existingByUsername = await userRepository.findByUsername(username);
            if (existingByUsername) {
                throw new Error('Username already in use');
            }

            const hashedPassword = await hashPassword(password);

            const user = await userRepository.createUser({
                email,
                username,
                password: hashedPassword,
                verificationToken: createId()
            });

            await userRepository.createProfile({
                userId: user.id
            });

            return user;
        },

        async signIn(emailOrUsername: string, password: string) {
            const userRepository = store.userRepository;

            const isEmail = emailOrUsername.includes('@');
            const user = isEmail
                ? await userRepository.findByEmail(emailOrUsername)
                : await userRepository.findByUsername(emailOrUsername);

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValid = await verifyPassword(password, user.password);
            if (!isValid) {
                throw new Error('Invalid credentials');
            }

            const token = await jwt.sign({
                userId: user.id,
                role: user.role
            });

            const session = await userRepository.createSession({
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                },
                token,
                expiresAt: session.expiresAt
            };
        },

        async verifyToken(token: string) {
            const payload = await jwt.verify(token);
            if (!payload) {
                return null;
            }

            return payload;
        }
    }))
    .as("plugin");
