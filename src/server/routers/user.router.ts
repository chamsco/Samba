import { createRouter } from '../createRouter';
import * as trpc from '@trpc/server';
import { getMeHandler } from '../controllers/user.controller';

const userRouter = createRouter()
  .query('me', {
    resolve: ({ ctx }) => getMeHandler({ ctx }),
  });

export default userRouter;