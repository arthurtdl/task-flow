import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address format.' })
    .nonempty({ message: 'Email is required.' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required.' }),
});

export type LoginDTO = z.infer<typeof loginSchema>;