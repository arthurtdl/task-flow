import { z } from 'zod';

export const createUserSchema = z.object({
    name: z
    .string()
    .nonempty({ message: 'Name is required' }),
    email: z
    .string()
    .email({ message: 'Invalid email address' })
    .nonempty({ message: 'Email is required' }),
    password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .nonempty({ message: 'Password is required' }),
    role: z
    .enum(['USER', 'ADMIN'])
    .optional(),
})

export type CreateUserDTO = z.infer<typeof createUserSchema>;