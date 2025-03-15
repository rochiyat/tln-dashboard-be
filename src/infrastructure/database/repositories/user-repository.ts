import { profiles, sessions, users } from '../schema/users';

import { ProfileEntity } from '../../../domain/entities/profile';
import { SessionEntity } from '../../../domain/entities/session';
import { UserEntity } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { createId } from '@paralleldrive/cuid2';
import { db } from '../index';
import { eq } from 'drizzle-orm';

export class DrizzleUserRepository implements UserRepository {
    async findById(id: string): Promise<UserEntity | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.id, id)
        });

        return result || null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        return result || null;
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.username, username)
        });

        return result || null;
    }

    async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
        const [user] = await db.insert(users)
            .values({
                id: createId(),
                email: userData.email!,
                username: userData.username!,
                password: userData.password!,
                role: userData.role || "user",
                verified: userData.verified ?? false,
                verificationToken: userData.verificationToken || null,
                resetPasswordToken: userData.resetPasswordToken || null,
                resetPasswordExpiry: userData.resetPasswordExpiry || null,
                createdAt: userData.createdAt || new Date(),
                updatedAt: userData.updatedAt || new Date()
            })
            .returning();

        return user;
    }

    async updateUser(id: string, userData: Partial<UserEntity>): Promise<UserEntity> {
        const [updated] = await db.update(users)
            .set({
                ...userData,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning();

        return updated;
    }

    async deleteUser(id: string): Promise<boolean> {
        await db.delete(users)
            .where(eq(users.id, id));

        return true;
    }

    async verifyUser(id: string): Promise<UserEntity> {
        const [user] = await db.update(users)
            .set({
                verified: true,
                verificationToken: null,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning();

        return user;
    }

    async getProfile(userId: string): Promise<ProfileEntity | null> {
        const result = await db.query.profiles.findFirst({
            where: eq(profiles.userId, userId)
        });

        return result || null;
    }

    async createProfile(profileData: Partial<ProfileEntity>): Promise<ProfileEntity> {
        const [profile] = await db.insert(profiles)
            .values({
                id: createId(),
                userId: profileData.userId!,
                fullName: profileData.fullName || null,
                bio: profileData.bio || null,
                avatarUrl: profileData.avatarUrl || null,
                location: profileData.location || null,
                website: profileData.website || null,
                createdAt: profileData.createdAt || new Date(),
                updatedAt: profileData.updatedAt || new Date()
            })
            .returning();

        return profile;
    }

    async updateProfile(userId: string, profileData: Partial<ProfileEntity>): Promise<ProfileEntity> {
        const existing = await this.getProfile(userId);

        if (!existing) {
            return this.createProfile({
                ...profileData,
                userId
            });
        }

        const [updated] = await db.update(profiles)
            .set({
                ...profileData,
                updatedAt: new Date()
            })
            .where(eq(profiles.userId, userId))
            .returning();

        return updated;
    }

    async createSession(sessionData: Partial<SessionEntity>): Promise<SessionEntity> {
        const [session] = await db.insert(sessions)
            .values({
                id: createId(),
                userId: sessionData.userId!,
                token: sessionData.token!,
                expiresAt: sessionData.expiresAt!,
                createdAt: sessionData.createdAt || new Date(),
                updatedAt: sessionData.updatedAt || new Date()
            })
            .returning();

        return session;
    }

    async findSessionByToken(token: string): Promise<SessionEntity | null> {
        const result = await db.query.sessions.findFirst({
            where: eq(sessions.token, token)
        });

        return result || null;
    }

    async deleteSession(id: string): Promise<boolean> {
        await db.delete(sessions)
            .where(eq(sessions.id, id));

        return true;
    }

    async deleteAllUserSessions(userId: string): Promise<boolean> {
        await db.delete(sessions)
            .where(eq(sessions.userId, userId));

        return true;
    }
}