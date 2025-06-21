import { Elysia, error } from 'elysia';
import { userCvsService } from '@/application/services/user-cvs.service';
import { authMiddleware } from '@/interface/middleware/auth-middleware';
import { returnSuccess } from '@/infrastructure/utils/http.util';
import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query';

export const userCvsControllerV1 = new Elysia({ prefix: '/user-cvs' })
  .use(userCvsService)
  .use(authMiddleware)

  .get('/firestore/:id', async ({ params, getUserCvsByIdFirestore, error }) => {
    try {
      if (!params.id) {
        return error(400, 'User ID is required');
      }

      const cvs = await getUserCvsByIdFirestore(params.id);
      console.log('cvs', cvs);
      return returnSuccess('Get User CVs Successfully', cvs);
    } catch (err: any) {
      return error(500, err.message || 'Get User CVs Failed');
    }
  })

  .get('/firestore', async ({ query, getUserCvsFirestore, error }) => {
    try {
      const cvs = await getUserCvsFirestore({
        cv_publish_state: query.cv_publish_state,
        limit: Number(query.limit),
        nama: query.nama,
      });
      return returnSuccess('Get User CVs Successfully', cvs);
    } catch (err: any) {
      return error(500, err.message || 'Get User CVs Failed');
    }
  })

  .get('/', async ({ query, getUserCvsAll, error }) => {
    try {
      const { limit, page, key } = query;

      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);

      if (isNaN(parsedLimit) || isNaN(parsedPage)) {
        return error(
          400,
          'Invalid query parameters: limit and page must be numbers'
        );
      }

      const findAllUserCvs = await getUserCvsAll({
        limit: parsedLimit,
        page: parsedPage,
        key,
      });

      return findAllUserCvs;
    } catch (err: any) {
      return error(500, err.message || 'Get User CVs Failed');
    }
  });
