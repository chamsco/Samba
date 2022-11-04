import { Prisma, Product } from '@prisma/client';
import { prisma } from '../../utils/prisma';

// create a Product
export const createProduct = async (input: Prisma.ProductCreateInput) => {
  return (await prisma.product.create({
    data: input,
  })) as Product;
};

// find a Product
export const findProduct = async(
  where: Partial<Prisma.ProductWhereInput>,
  select?: Prisma.ProductSelect
) => {
  return (await prisma.product.findFirst({
    where,
    select,
  })) as Product; 
};

// find a Product by unique id
export const findUniqueProduct = async(
  where: Prisma.ProductWhereUniqueInput,

  select?: Prisma.ProductSelect
) => {
  return (await prisma.product.findUnique({
    where,
    select,
  })) as Product;
}

//find all products
export const findAllProducts = async (
  page: number, limit: number,
) => {
  //include: {shop: true},
  const take = limit || 10;
  const skip = (page - 1 ) * limit
  return (await prisma.product.findMany({
    take,
    skip,
  })) as Product[];
};

// update a Product
export const updateProduct = async(
  where: Partial<Prisma.ProductWhereUniqueInput>,
  data: Prisma.ProductUpdateInput,
  select?: Prisma.ProductSelect
) => {
  return (await prisma.product.update({ where, data, select })) as Product;
}

//delete a Product
export const deleteProduct = async(
  where: Prisma.ProductWhereUniqueInput,
) => {
  return (await prisma.product.delete({
    where,
  })) as Product;
}
