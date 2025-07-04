import { Elysia } from 'elysia';
import dayjs from 'dayjs';
import { db } from '@/infrastructure/firebase';
import { collections } from '@/infrastructure/firebase/collections';
import { DrizzleUserCvsRepository } from '@/infrastructure/database/repositories/user-cvs.repository';

export const userCvsService = new Elysia({ name: 'Service.UserCvs' })
  .state('userCvsRepository', new DrizzleUserCvsRepository())
  .derive(({ store }) => ({
    async getUserCvsByIdFirestore(id: string) {
      const userCvs = await db.collection(collections.userCvs).doc(id).get();
      const getUserCvs = {
        id: userCvs.id,
        ...userCvs.data(),
      };

      return getUserCvs;
    },

    async getUserCvsFirestore(query: {
      cv_publish_state: string;
      limit: number;
      nama: string;
    }) {
      const { cv_publish_state, limit, nama } = query;

      let userCvsRef = await db
        .collection(collections.userCvs)
        .orderBy('last_updated', 'desc');

      let userCvs;
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

      userCvs = await userCvsRef.limit(limit).get();

      const getUserCvs = userCvs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return getUserCvs;
    },

    async getUserCvsAll(query: { limit: number; page: number; key: string }) {
      const { limit, page } = query;
      const offset = (page - 1) * limit;
      if (query.key) {
        query.key = query.key.toLowerCase();
      }

      const userCvsList = await store.userCvsRepository.findAll(
        limit,
        offset,
        query
      );
      const userCvsCount = await store.userCvsRepository.count(query);

      const result = {
        success: true,
        message: 'Get User CVs Success',
        data: userCvsList,
        count: userCvsCount,
      };

      return result;
    },

    async getUserCvsByPublicUid(query: { publicUid: string }) {
      const { publicUid } = query;
      const userCvs = await store.userCvsRepository.findByPublicUid(publicUid);

      const result = {
        success: true,
        message: 'Get User CVs By Public UID Success',
        data: userCvs,
      };

      return result;
    },
  }))
  .as('plugin');
