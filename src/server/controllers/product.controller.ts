import { TRPCError } from '@trpc/server';
import { Context } from '../createContext';
import {
  CreateProductInput,
  FilterQueryInput,
  ParamsInput,
  UpdateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findUniqueProduct,
  updateProduct,
} from '../services/product.service';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime';

// [...] Create Product Handler
export const createProductHandler = async ({
  input,
  ctx,
}: {
  input: CreateProductInput;
  ctx: Context;
}) => {
  try {
    const {user} = await ctx.prisma.users;

    const post = await createProduct({
      name: input.name,
      description: input.description,
      category: input.category,
      image: input.image,
      user: {connect: {id: user?.id}},
    });

    return {
      status: 'success',
      data: {
        post,
      },
    };
  } catch (err: any) {
    if (err.code === 'P2002') {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Post with that title already exists',
      });
    }
    throw err;
  }
};
      
// [...] Get Single Product Handler
export const getProductHandler = async({
  paramsInput,
}: {
  paramsInput: ParamsInput;
  }) => {
  try {
    const Product = await findUniqueProduct({ id: paramsInput.productId });
    if (!Product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product with that ID not found',
      });
    }
    return {
      status: 'success',
      data: {
        Product,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};




// [...] Get All Product Handler
export const getProductsHandler = async ({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) => {
  try {
    const Product = await findAllProducts(filterQuery.page, filterQuery.limit)

    return {
      status: 'success',
      results: Product.length,
      data: {
        Product,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

// [...] Delete Post Handler
export const deleteProductHandler = async ({
  paramsInput,
}: {
  paramsInput: ParamsInput;
}) => {
  try {
    const post = await deleteProduct({ id: paramsInput.productId });

    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post with that ID not found',
      });
    }

    return {
      status: 'success',
      data: null,
    };
  } catch (err: any) {
    throw err;
  }
};

// [...] Update Product Handler
export const updateProductHandler = async ({
  paramsInput,
  input,
}: {
  paramsInput: ParamsInput;
  input: UpdateProductInput;
}) => {
  try {
    const post = await updateProduct({ id: paramsInput.productId }, input);

    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post with that ID not found',
      });
    }

    return {
      status: 'success',
      data: {
        post,
      },
    };
  } catch (err: any) {
    throw err;
  }
};
