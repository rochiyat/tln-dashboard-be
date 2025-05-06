import { Elysia } from 'elysia';
import { authControllerV1 } from '@/interface/controllers/v1/auth.controller';
import { userControllerV1 } from '@/interface/controllers/v1/user.controller';
import { userCvsControllerV1 } from '@/interface/controllers/v1/user-cvs.controller';
export const v1Routes = new Elysia({ prefix: '/api/v1' })
  .use(authControllerV1)
  .use(userControllerV1)
  .use(userCvsControllerV1);
