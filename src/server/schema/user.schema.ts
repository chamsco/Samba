import z, { string } from "zod" 
import { UserModel } from "../../zod/user";

export const createUserSchema = z.object({
  username: z.string({ required_error: 'Nom is required' }),
  Nom: z.string({ required_error: 'Nom is required' }),
  Prenom: z.string({ required_error: 'Nom is required' }),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  Phone_Number: z.string().optional(),
  phone_number_verified: z.boolean().optional(),
  password: z.string({ required_error: 'Nom is required' })
  .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

export const createUserOutputSchema = z.object({
  username: z.string(),
  Nom: z.string(),
  Prenom: z.string(),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  Phone_Number: z.string().optional(),
  phone_number_verified: z.boolean().optional(),
  password:z.string()
})


export const loginUserSchema = z.object({
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email address is required')
    .email(
    'Invalid email'),
  password: string({ required_error: 'Password is required' })
  .min(1, 'Password is required')
  .min(8, 'Password invalid')
  .max(32, 'Password invalid'),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type createUserOutput = z.infer<typeof createUserSchema>;
