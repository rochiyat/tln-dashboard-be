import { Elysia } from 'elysia';
import { userCvsService } from '@/application/services/user-cvs.service';
import { authMiddleware } from '@/interface/middleware/auth-middleware';

export const userCvsControllerV1 = new Elysia({ prefix: '/user-cvs' })
  .use(userCvsService)
  .use(authMiddleware)

  .get('/:id', async ({ params, getUserCvsById, error }) => {
    try {
      if (!params.id) {
        return error(400, 'User ID is required');
      }

      const cvs = await getUserCvsById(params.id);

      return {
        status: 'success',
        data: cvs,
      };
    } catch (err: any) {
      return error(500, {
        status: 'error',
        message: err.message || 'Internal Server Error',
      });
    }
  });
