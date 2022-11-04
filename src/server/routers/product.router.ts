import { createRouter } from '../createRouter';
import * as trpc from '@trpc/server';
import { createProductSchema, filterQuery, params, updateProductSchema } from '../schema/product.schema';
import { createProductHandler, deleteProductHandler, getProductHandler, getProductsHandler, updateProductHandler } from '../controllers/product.controller';

  const ProductRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!(await ctx).user) {
      throw new trpc.TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }
    return next();
  })
  .mutation('create', {
    input: createProductSchema,
    resolve: ({ input }) => createProductHandler({ input }),
  })
  .mutation('update', {
    input: updateProductSchema,
    resolve: ({ input }) =>
      updateProductHandler({ paramsInput: input.params, input: input.body }),
  })
  .mutation('delete', {
    input: params,
    resolve: ({ input }) => deleteProductHandler({ paramsInput: input }),
  })
  .query('getProduct', {
    input: params,
    resolve: ({ input }) => getProductHandler({ paramsInput: input }),
  })
  .query('getProducts', {
    input: filterQuery,
    resolve: ({ input }) => getProductsHandler({ filterQuery: input }),
  });

export default ProductRouter;
