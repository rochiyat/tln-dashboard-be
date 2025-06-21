import { UserCvsEntity, userCvsList } from '../entities/user-cvs';

export interface UserCvsRepository {
  findAll(
    limit: number,
    offset: number,
    query: { key: string }
  ): Promise<userCvsList[]>;
  count(query: { key: string }): Promise<number>;
  findByPublicUid(publicUid: string): Promise<UserCvsEntity | null>;
}
