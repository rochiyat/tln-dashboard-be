export interface ProfileEntity {
    id: string;
    userId: string;
    fullName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    location?: string | null;
    website?: string | null;
    createdAt: Date;
    updatedAt: Date;
}