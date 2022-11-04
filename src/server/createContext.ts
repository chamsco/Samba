import { NextApiRequest,NextApiResponse } from "next";
import { prisma } from "../utils/prisma";
import { deserializeUser } from '../middleware/deserializeUser';
import { Prisma,Users } from "@prisma/client";

// export a context that returns the prisma client and the user


export const createContext = ({ req, res }:{ req: NextApiRequest, res: NextApiResponse }) => {
  //deserializeUser({ req, res });
  return {
    req, res, prisma
}
}

export type Context = ReturnType<typeof createContext>

// export type Context = {
//   req: NextApiRequest;
//   res: NextApiResponse;
//   prisma: PrismaClient;
//   user: User | null;
// };

// export const createContext = ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {  
//     return deserializeUser({ req, res });;
// };
