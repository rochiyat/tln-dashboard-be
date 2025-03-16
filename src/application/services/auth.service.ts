import { hashPassword, verifyPassword } from '@/infrastructure/utils/password';

import { DrizzleUserRepository } from '@/infrastructure/database/repositories/user.repository';
import { Elysia } from 'elysia';
import { createId } from '@paralleldrive/cuid2';
import { emailService } from '@/infrastructure/email/email.service';
import { jwt } from '@elysiajs/jwt';
import { logger } from '@/infrastructure/logger';
import { redisClient } from '@/infrastructure/redis';

const generateOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

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

        async signUp(email: string, username: string, password: string, useOTP: boolean = false) {
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
                verified: false
            });

            await userRepository.createProfile({
                userId: user.id
            });

            if (useOTP) {

                const otp = generateOTP();


                const redisKey = `otp:${user.id}`;
                await redisClient.set(redisKey, otp.toString(), { EX: 10 * 60 });


                try {
                    await emailService.sendOTPEmail(email, username, otp);
                    logger.info(`OTP email sent to ${email}`);
                } catch (error) {
                    logger.error('Error sending OTP email', { error, userId: user.id });

                }
            } else {

                const verificationToken = createId();


                await userRepository.updateUser(user.id, { verificationToken });


                try {
                    await emailService.sendVerificationEmail(email, username, verificationToken);
                    logger.info(`Verification email sent to ${email}`);
                } catch (error) {
                    logger.error('Error sending verification email', { error, userId: user.id });
                }
            }

            return user;
        },


        async verifyEmailWithOTP(userId: string, otp: string) {
            const userRepository = store.userRepository;


            const user = await userRepository.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }


            const redisKey = `otp:${userId}`;
            const storedOTP = await redisClient.get(redisKey);

            if (!storedOTP || storedOTP !== otp) {
                throw new Error('Invalid or expired OTP');
            }


            const updatedUser = await userRepository.verifyUser(user.id);


            await redisClient.del(redisKey);

            logger.info(`User verified via OTP: ${user.id}`);

            return updatedUser;
        },


        async requestNewOTP(email: string) {
            const userRepository = store.userRepository;


            const user = await userRepository.findByEmail(email);

            if (!user) {

                logger.info(`OTP requested for non-existent email: ${email}`);
                return { success: true };
            }


            if (user.verified) {
                return { success: true, verified: true };
            }


            const otp = generateOTP();


            const redisKey = `otp:${user.id}`;
            await redisClient.set(redisKey, otp.toString(), { EX: 10 * 60 });


            try {
                await emailService.sendOTPEmail(user.email, user.username, otp);
                logger.info(`New OTP email sent to ${user.email}`);
            } catch (error) {
                logger.error('Error sending OTP email', { error, userId: user.id });
                throw new Error('Failed to send OTP email');
            }

            return { success: true };
        },


        async verifyEmail(token: string) {
            const userRepository = store.userRepository;


            const user = await userRepository.findByVerificationToken(token);

            if (!user) {
                throw new Error('Invalid or expired verification token');
            }


            const updatedUser = await userRepository.verifyUser(user.id);

            logger.info(`User verified: ${user.id}`);

            return updatedUser;
        },


        async requestPasswordReset(email: string, useOTP: boolean = false) {
            const userRepository = store.userRepository;


            const user = await userRepository.findByEmail(email);

            if (!user) {

                logger.info(`Password reset requested for non-existent email: ${email}`);
                return { success: true };
            }

            if (useOTP) {

                const otp = generateOTP();


                const redisKey = `password-reset-otp:${user.id}`;
                await redisClient.set(redisKey, otp.toString(), { EX: 60 * 60 });


                try {
                    await emailService.sendOTPEmail(user.email, user.username, otp);
                    logger.info(`Password reset OTP sent to ${user.email}`);
                } catch (error) {
                    logger.error('Error sending password reset OTP', { error, userId: user.id });
                    throw new Error('Failed to send password reset OTP');
                }
            } else {

                const resetToken = createId();
                const resetExpiryHours = 1;


                const redisKey = `password-reset:${resetToken}`;
                await redisClient.set(redisKey, user.id, { EX: resetExpiryHours * 60 * 60 });


                try {
                    await emailService.sendPasswordResetEmail(user.email, user.username, resetToken);
                    logger.info(`Password reset email sent to ${user.email}`);
                } catch (error) {
                    logger.error('Error sending password reset email', { error, userId: user.id });
                    throw new Error('Failed to send password reset email');
                }
            }

            return { success: true };
        },


        async resetPasswordWithOTP(email: string, otp: string, newPassword: string) {
            const userRepository = store.userRepository;


            const user = await userRepository.findByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }


            const redisKey = `password-reset-otp:${user.id}`;
            const storedOTP = await redisClient.get(redisKey);

            if (!storedOTP || storedOTP !== otp) {
                throw new Error('Invalid or expired OTP');
            }


            const hashedPassword = await hashPassword(newPassword);


            await userRepository.updateUser(user.id, {
                password: hashedPassword
            });


            await redisClient.del(redisKey);


            await userRepository.deleteAllUserSessions(user.id);

            logger.info(`Password reset successful with OTP for user: ${user.id}`);

            return { success: true };
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


            if (!user.verified) {
                throw new Error('Please verify your email before signing in');
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
    .as("scoped");
