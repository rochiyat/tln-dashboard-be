import { Elysia, t } from 'elysia';
import { describe, expect, test } from 'bun:test';

import { DrizzleUserRepository } from '../infrastructure/database/repositories/user-repository';
import { authService } from '@/application/services/auth.service';

class MockUserRepository extends DrizzleUserRepository {
    async findByEmail() {
        return null;
    }

    async findByUsername() {
        return null;
    }

    async createUser(userData: any) {
        return {
            id: '1',
            email: userData.email,
            username: userData.username,
            password: userData.password,
            role: 'user',
            verified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    async createProfile() {
        return {
            id: '1',
            userId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}

describe('Auth Service', () => {
    const app = new Elysia()
        .use(authService)
        .state('userRepository', new MockUserRepository())
        .post('/test-signup', async ({ body, signUp }) => {
            return await signUp(body.email, body.username, body.password);
        }, {
            body: t.Object({
                email: t.String(),
                username: t.String(),
                password: t.String()
            }),
        });

    test('should sign up a user', async () => {
        const response = await app.handle(
            new Request('http://localhost/test-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password123'
                })
            })
        );

        const result = await response.json();

        expect(result).toBeDefined();
        expect(result.id).toBe('1');
        expect(result.email).toBe('test@example.com');
        expect(result.username).toBe('testuser');
    });
});