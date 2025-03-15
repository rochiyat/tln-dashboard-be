export interface UserEntity {
    id: string;
    email: string;
    username: string;
    password: string;
    role: string;
    verified: boolean;
    verificationToken?: string | null;
    resetPasswordToken?: string | null;
    resetPasswordExpiry?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}  