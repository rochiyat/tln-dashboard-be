import { Elysia } from 'elysia';
import { userCvsService } from '@/application/services/user-cvs.service';
import { authMiddleware } from '@/interface/middleware/auth-middleware';
import { returnSuccess } from '@/infrastructure/utils/http.util';

export const userCvsControllerV1 = new Elysia({ prefix: '/user-cvs' })
  .use(userCvsService)
  .use(authMiddleware)

  .get('/:id', async ({ params, getUserCvsById, error }) => {
    try {
      if (!params.id) {
        return error(400, 'User ID is required');
      }

      const cvs = await getUserCvsById(params.id);
      console.log('cvs', cvs);
      return returnSuccess('Get User CVs Successfully', cvs);
    } catch (err: any) {
      return error(500, err.message || 'Get User CVs Failed');
    }
  })

  .get('/', async ({ query, getUserCvs, error }) => {
    try {
      const cvs = await getUserCvs({
        cv_publish_state: query.cv_publish_state,
        limit: Number(query.limit),
        nama: query.nama,
      });
      return returnSuccess('Get User CVs Successfully', cvs);
    } catch (err: any) {
      return error(500, err.message || 'Get User CVs Failed');
    }
  });
