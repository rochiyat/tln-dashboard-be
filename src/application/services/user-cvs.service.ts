import { Elysia } from 'elysia';
import { db } from '@/infrastructure/firebase';

export const userCvsService = new Elysia({ name: 'Service.UserCvs' })
  .derive(({ store }) => ({
    async getUserCvsById(id: string) {
      const userCvsRepository = await db.collection('userCvs').doc(id).get();

      const getUserCvs = {
        id: userCvsRepository.id,
        ...userCvsRepository.data(),
      };

      return getUserCvs;
    },
  }))
  .as('plugin');
