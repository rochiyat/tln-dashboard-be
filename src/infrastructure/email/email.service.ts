import { OTPEmail } from './templates/otp-email';
import { PasswordResetEmail } from './templates/password-reset-email';
import { Resend } from 'resend';
import { VerificationEmail } from './templates/verification-email';
import { logger } from '../logger';
import { render } from '@react-email/render';

export class EmailService {
    private resend: Resend;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            logger.warn('RESEND_API_KEY is not set. Email sending will not work.');
        }
        this.resend = new Resend(apiKey);
    }

    async sendVerificationEmail(to: string, username: string, token: string) {
        const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

        const html = await render(VerificationEmail({
            username,
            verificationLink
        }));

        try {
            const data = await this.resend.emails.send({
                from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                to,
                subject: 'Verify Your Email Address',
                html
            });

            logger.info(`Verification email sent: ${data.data?.id}`);

            return { success: true, messageId: data.data?.id };
        } catch (error: any) {
            logger.error('Error sending verification email', {
                error: error.message,
                name: error.name,
                statusCode: error.statusCode
            });
            throw new Error('Failed to send verification email');
        }
    }

    async sendPasswordResetEmail(to: string, username: string, token: string) {
        const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

        const html = await render(PasswordResetEmail({
            username,
            resetLink
        }));

        try {
            const data = await this.resend.emails.send({
                from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                to,
                subject: 'Reset Your Password',
                html
            });

            logger.info(`Password reset email sent: ${data.data?.id}`);

            return { success: true, messageId: data.data?.id };
        } catch (error: any) {
            logger.error('Error sending password reset email', {
                error: error.message,
                name: error.name,
                statusCode: error.statusCode
            });
            throw new Error('Failed to send password reset email');
        }
    }

    async sendOTPEmail(to: string, username: string, otp: number) {
        const html = await render(OTPEmail({
            username,
            otp
        }));

        try {
            const data = await this.resend.emails.send({
                from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                to,
                subject: 'Your Verification Code',
                html
            });

            logger.info(`OTP email sent: ${data.data?.id}`);

            return { success: true, messageId: data.data?.id };
        } catch (error: any) {
            logger.error('Error sending OTP email', {
                error: error.message,
                name: error.name,
                statusCode: error.statusCode
            });
            throw new Error('Failed to send OTP email');
        }
    }
}

export const emailService = new EmailService();