import { ProfileEntity } from '../entities/profile';
import { SessionEntity } from '../entities/session';
import { UserEntity } from '../entities/user';

export interface UserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByUsername(username: string): Promise<UserEntity | null>;
    createUser(userData: Partial<UserEntity>): Promise<UserEntity>;
    updateUser(id: string, userData: Partial<UserEntity>): Promise<UserEntity>;
    deleteUser(id: string): Promise<boolean>;
    verifyUser(id: string): Promise<UserEntity>;
    getProfile(userId: string): Promise<ProfileEntity | null>;
    createProfile(profileData: Partial<ProfileEntity>): Promise<ProfileEntity>;
    updateProfile(userId: string, profileData: Partial<ProfileEntity>): Promise<ProfileEntity>;
    createSession(sessionData: Partial<SessionEntity>): Promise<SessionEntity>;
    findSessionByToken(token: string): Promise<SessionEntity | null>;
    deleteSession(id: string): Promise<boolean>;
    deleteAllUserSessions(userId: string): Promise<boolean>;
}