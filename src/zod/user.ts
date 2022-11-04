import z, { string } from "zod" 

export const UserModel = z.object({
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
