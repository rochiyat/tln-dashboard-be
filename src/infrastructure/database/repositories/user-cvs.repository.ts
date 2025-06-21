import { like, sql, or, desc } from 'drizzle-orm';
import { userCvs } from '../schema/tln';
import { UserCvsRepository } from '@/domain/repositories/user-cvs-repository';
import { userCvsList } from '@/domain/entities/user-cvs';
import { dbTln } from '../db-tln';

export class DrizzleUserCvsRepository implements UserCvsRepository {
  async findAll(
    limit: number,
    offset: number,
    query?: { key: string }
  ): Promise<userCvsList[]> {
    const conditions = [];
    const key = query?.key;
    if (key) {
      conditions.push(like(userCvs.nama, `%${query.key}%`));
      conditions.push(like(userCvs.publicUid, `%${query.key}%`));
    }

    const rows = await dbTln
      .select({
        id: userCvs.id,
        userId: userCvs.userId,
        firestoreDocId: userCvs.firestoreDocId,
        nama: userCvs.nama,
        cvPublishState: userCvs.cvPublishState,
        cvPublishExpiry: userCvs.cvPublishExpiry,
        cvPendingExpiry: userCvs.cvPendingExpiry,
        uid: userCvs.uid,
        publicUid: userCvs.publicUid,
      })
      .from(userCvs)
      .where(or(...conditions))
      .orderBy(desc(userCvs.updatedAt))
      .limit(limit)
      .offset(offset);
    console.log('conditions', conditions);

    return rows;
  }

  async count(query: { key: string }): Promise<number> {
    const conditions = [];
    const key = query?.key;

    if (key) {
      conditions.push(like(userCvs.nama, `%${query.key}%`));
      conditions.push(like(userCvs.publicUid, `${query.key}`));
    }
    const result = await dbTln
      .select({
        count: sql<number>`count(*)`,
      })
      .from(userCvs)
      .where(or(...conditions));

    return result[0].count;
  }
}
