import { boolean, number, object, string, TypeOf } from 'zod';

export const createProductSchema = object({
  name: string({
    required_error: 'Title is required',
  }),
  description: string({
    required_error: 'Content is required',
  }),
  Category: string({
    required_error: 'Category is required',
  }),
  image: string({
    required_error: 'Image is required',
  }),
});

export const params = object({
  productId: string(),
});

export const updateProductSchema = object({
  params,
  body: object({
    name: string(),
    description: string(),
    category: string(),
    image: string(),
  }).partial(),
});

export const filterQuery = object({
  limit: number().default(1),
  page: number().default(10),
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type ParamsInput = TypeOf<typeof params>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>['body'];
export type FilterQueryInput = TypeOf<typeof filterQuery>;
