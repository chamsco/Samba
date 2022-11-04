import z, { string } from "zod" 

export const ProductModel = z.object({
  name: z.string({ required_error: 'Nom is required' }),
  description: z.string({ required_error: 'Nom is required' }),
  price: z.string({ required_error: 'Price is required' }),
  category: z.string().email().optional(),
  quantity: z.boolean().optional(),
})
