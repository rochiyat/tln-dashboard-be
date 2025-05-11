import { userCvs } from '../schema/tln';
import { desc } from 'drizzle-orm';
import { UserCvsRepository } from '@/domain/repositories/user-cvs-repository';
import { userCvsList } from '@/domain/entities/user-cvs';
import { dbTln } from '../db-tln';

export class DrizzleUserCvsRepository implements UserCvsRepository {
  async findAll(limit: number, offset: number): Promise<userCvsList[]> {
    const result = await dbTln
      .select({
        id: userCvs.id,
        userId: userCvs.userId,
        firestoreDocId: userCvs.firestoreDocId,
      })
      .from(userCvs)
      .orderBy(desc(userCvs.updatedAt))
      .limit(limit)
      .offset(offset);

    return result;
  }
}
