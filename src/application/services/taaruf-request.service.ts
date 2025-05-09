import { Elysia } from 'elysia';
import { db } from '@/infrastructure/firebase';
import { collections } from '@/infrastructure/firebase/collections';

export const taarufRequestService = new Elysia({
  name: 'Service.TaarufRequest',
})
  .derive(({ store }) => ({
    async getTaarufRequestById(id: string) {
      const taarufRequestRepository = await db
        .collection(collections.taarufRequest)
        .doc(id)
        .get();
      const getTaarufRequest = {
        id: taarufRequestRepository.id,
        ...taarufRequestRepository.data(),
      };

      return getTaarufRequest;
    },

    async getTaarufRequest(query: {
      cv_publish_state: string;
      limit: number;
      nama: string;
    }) {
      const { cv_publish_state, limit, nama } = query;

      let taarufRequestRef = await db
        .collection(collections.taarufRequest)
        .orderBy('last_updated', 'desc');

      let taarufRequestRepository;
      if (cv_publish_state) {
        console.log('cv_publish_state', cv_publish_state);
        taarufRequestRef = taarufRequestRef.where(
          'cv_publish_state',
          '==',
          `${cv_publish_state}`
        );
      }

      if (nama) {
        console.log('nama', nama);
        taarufRequestRef = taarufRequestRef.where('nama', '==', `${nama}`);
      }

      taarufRequestRepository = await taarufRequestRef.limit(limit).get();

      const getTaarufRequest = taarufRequestRepository.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return getTaarufRequest;
    },
  }))
  .as('plugin');
