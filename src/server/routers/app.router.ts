import { createRouter } from "../createRouter";
import  userRouter  from "./user.router"
import productRouter from "./product.router"
import authRouter from './auth.routes';
import { z } from 'zod';

export const appRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      };
    },
  })
  .merge('auth.', authRouter)
  .merge('users.', userRouter)
  .merge('products.', productRouter)
  //mutation to see who is logged in and greet him based on the access token in the cookies

export type AppRouter = typeof appRouter