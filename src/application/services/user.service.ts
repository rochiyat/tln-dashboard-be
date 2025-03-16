import { DrizzleUserRepository } from '@/infrastructure/database/repositories/user.repository';
import { Elysia } from 'elysia';

export const userService = new Elysia({ name: 'Service.User' })
    .state('userRepository', new DrizzleUserRepository())
    .derive(({ store }) => ({
        async getProfile(userId: string) {
            const userRepository = store.userRepository;

            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const profile = await userRepository.getProfile(userId);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    verified: user.verified,
                    createdAt: user.createdAt
                },
                profile: {
                    fullName: profile?.fullName || null,
                    bio: profile?.bio || null,
                    avatarUrl: profile?.avatarUrl || null,
                    location: profile?.location || null,
                    website: profile?.website || null
                }
            };
        },

        async updateProfile(userId: string, profileData: any) {
            const userRepository = store.userRepository;

            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const profile = await userRepository.updateProfile(userId, profileData);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    verified: user.verified
                },
                profile: {
                    fullName: profile.fullName || null,
                    bio: profile.bio || null,
                    avatarUrl: profile.avatarUrl || null,
                    location: profile.location || null,
                    website: profile.website || null
                }
            };
        }
    }))
    .as("plugin");