import { TRPCError } from '@trpc/server';
import { Prisma, Users } from '@prisma/client';
import { serialize } from "cookie";
import bcrypt from 'bcryptjs';
import { CookieOptions } from 'express';
import { Context } from '../createContext';
import customConfig from '../../config/default';
import * as trpc from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { CreateUserInput, LoginUserInput } from '../schema/user.schema';
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUniqueUser,
  findUser,
  signTokens,
} from '../services/user.service';
import redisClient from '../../utils/connectRedis';
import { signJwt, verifyJwt } from '../../utils/jwt';
// [...] Imports

const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || "super duper secret key";

// [...] Cookie Options


const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

const accessTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000
  ),
};


function setCookie(
  res: any,
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): void {
  const stringValue =
    typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
}


// [...] Register User Handler
export const registerHandler = async ({input, ctx}: { input: CreateUserInput, ctx: Context }) => {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    if (input.password === input.passwordConfirm) {
      try {
        const user = await createUser({
          username: input.username,
          email: input.email?.toLowerCase(),
          Nom: input.Nom,
          Prenom: input.Prenom,
          password: hashedPassword,
        });
        return {
          status: 201,
          message: "Account created successfully",
          result: user.email,
        }
        // return user ;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists.",
            })
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:  "We had a fucky wucky.",
        })
      }
    } else {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "Passwords not matching"
      })
    
    }
    
    
  }

// [...] Login User Handler
export const loginHandler =
  async ({ input, ctx, }: { input: LoginUserInput; ctx: Context; }) => {
    try {
      const user = await findUser({ email: input.email.toLowerCase() });
      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid email or password',
        });
      }
      const { access_token, refresh_token } = await signTokens(user);

      setCookie(ctx.res, "access_token", access_token, accessTokenCookieOptions)
      //setCookie(ctx.res, "refresh_token", refresh_token, refreshTokenCookieOptions)
      //setCookie(ctx.res, "logged_in", "true", cookieOptions)

      return {
        status: 'success',
        access_token,
      };
    } catch (err: any) {
      throw err;
    }
};

// [...] Refresh Access Token Handler



// This removes the auth cookie, effectively logging out
// the user.
export function clearUser(res: NextApiResponse): void {
  setCookie(res, "auth", "0", {
    ...cookieOptions,
    path: "/",
    maxAge: 1,
  });
}
// [...] Logout User Handler
export const logout = async ({ ctx }: { ctx: Context }) => {
  setCookie(ctx.res,'access_token', '', { maxAge: -1 });
  setCookie(ctx.res, 'refresh_token', '', { maxAge: -1 });
  setCookie(ctx.res, 'logged_in', '', { maxAge: -1 });
};

// This gives back the user behind a given request
// either on API routes or getServerSideProps
export async function userFromRequest(
  req: IncomingMessage & { cookies: NextApiRequest['cookies'] }
): Promise<Users| null | undefined> {
  const { auth: token } = req.cookies;

  if (!token) return undefined;

  try {
    const data = jwt.verify(token, JWT_TOKEN_KEY);

    if (!data) return undefined;

    const user = await prisma?.users.findUnique({
      where: { email: (data as any).email },
    });

    if (user) user.password = "";

    return user;
  } catch (error) {
    return undefined;
  }
}

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const user = ctx?.prisma.users as unknown as Users;
    await redisClient.del(user?.id as string);
    logout({ ctx });
    return { status: 'success' };
  } catch (err: any) {
    throw err;
  }
};
