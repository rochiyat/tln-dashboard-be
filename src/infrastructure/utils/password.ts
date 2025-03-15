import { createHash } from 'crypto';

export async function hashPassword(password: string): Promise<string> {
    // TODO: replace to bcrypt
    return Bun.password.hash(password);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return Bun.password.verify(plainPassword, hashedPassword);
}