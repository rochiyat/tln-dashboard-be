import { Elysia } from 'elysia';
import { authMiddleware } from '@/interface/middleware/auth-middleware';
import { userService } from '@/application/services/user.service';
import { userValidators } from '@/interface/validators/v1/user-validators';

export const userControllerV1 = new Elysia({ prefix: '/users' })
  .use(userValidators)
  .use(userService)
  .use(authMiddleware)

  .get(
    '/me',
    async ({ user, getProfile, error }) => {
      try {
        console.log(`Getting profile for user: ${user}`);
        if (!user) {
          throw new Error('User not found');
        }

        const profile = await getProfile(user.id.toString());

        return {
          status: 'success',
          data: profile,
        };
      } catch (err: any) {
        return error(404, {
          status: 'error',
          message: err.message,
        });
      }
    },
    {
      authorize: ['user'],
      detail: {
        summary: 'Get current user profile',
        tags: ['Users'],
      },
    }
  )

  .patch(
    '/me',
    async ({ user, body, updateProfile, error }) => {
      try {
        if (!user) {
          throw new Error('User not found');
        }

        const updatedProfile = await updateProfile(user?.id.toString(), body);

        return {
          status: 'success',
          message: 'Profile updated successfully',
          data: updatedProfile,
        };
      } catch (err: any) {
        return error(400, {
          status: 'error',
          message: err.message,
        });
      }
    },
    {
      body: 'profile.update',
      authorize: ['user'],
      detail: {
        summary: 'Update current user profile',
        tags: ['Users'],
      },
    }
  )

  .get(
    '/:id',
    async ({ params, getProfile, error }) => {
      try {
        const profile = await getProfile(params.id);

        return {
          status: 'success',
          data: profile,
        };
      } catch (err: any) {
        return error(404, {
          status: 'error',
          message: err.message,
        });
      }
    },
    {
      authorize: ['admin', 'user'],
      detail: {
        summary: 'Get user profile by ID',
        tags: ['Users'],
      },
    }
  );
