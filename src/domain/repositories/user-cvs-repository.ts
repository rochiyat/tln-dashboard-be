import { userCvsList } from '../entities/user-cvs';

export interface UserCvsRepository {
  findAll(
    limit: number,
    offset: number,
    query: { key: string }
  ): Promise<userCvsList[]>;
}
