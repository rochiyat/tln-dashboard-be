export interface Badge {
  id: bigint;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
