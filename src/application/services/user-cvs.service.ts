import { Elysia } from 'elysia';
import { db } from '@/infrastructure/firebase';
import { collections } from '@/infrastructure/firebase/collections';
export const userCvsService = new Elysia({ name: 'Service.UserCvs' })
  .derive(({ store }) => ({
    async getUserCvsById(id: string) {
      const userCvsRepository = await db
        .collection(collections.userCvs)
        .doc(id)
        .get();
      const getUserCvs = {
        id: userCvsRepository.id,
        ...userCvsRepository.data(),
      };

      return getUserCvs;
    },

    async getUserCvs(query: {
      cv_publish_state: string;
      limit: number;
      nama: string;
    }) {
      const { cv_publish_state, limit, nama } = query;

      let userCvsRef = await db
        .collection(collections.userCvs)
        .orderBy('last_updated', 'desc');

      let userCvsRepository;
      if (cv_publish_state) {
        userCvsRef = userCvsRef.where(
          'cv_publish_state',
          '==',
          `${cv_publish_state}`
        );
      }

      if (nama) {
        userCvsRef = userCvsRef.where('nama', '==', `${nama}`);
      }

      userCvsRepository = await userCvsRef.limit(limit).get();

      const getUserCvs = userCvsRepository.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return getUserCvs;
    },
  }))
  .as('plugin');
