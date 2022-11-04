import { TRPCError } from '@trpc/server';
import type {Context}  from '../createContext';

  // with the help of the context, we can determine the user from the request
  // and return it
export const getMeHandler = ({ ctx }: { ctx: Context }) => {
  try {
    const user = ctx?.prisma.users as unknown;
    return user;
  } catch (error:any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
};


