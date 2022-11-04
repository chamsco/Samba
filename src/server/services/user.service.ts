import { Prisma, Users } from '@prisma/client';
import customConfig from '../../config/default';
import { signJwt } from '../../utils/jwt';
import { prisma } from '../../utils/prisma';

export const createUser = async (input: Prisma.UsersCreateInput) => {
  return (await prisma.users.create({
    data: input,
  })) as Users;
};

export const findUser = async (
  where: Partial<Prisma.UsersWhereInput>,
  select?: Prisma.UsersSelect
) => {
  return (await prisma.users.findFirst({
    where,
    select,
  })) as Users;
};


export const findUniqueUser = async (
  where: Prisma.UsersWhereUniqueInput,
  select?: Prisma.UsersSelect
) => {
  return (await prisma.users.findUnique({
    where,
    select,
  })) as Users;
};

export const updateUser = async (
  where: Partial<Prisma.UsersWhereUniqueInput>,
  data: Prisma.UsersUpdateInput,
  select?: Prisma.UsersSelect
) => {
  return (await prisma.users.update({ where, data, select })) as Users;
};
