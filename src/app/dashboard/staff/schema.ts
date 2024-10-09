import { z } from 'zod';

export const schema = z
  .object({
    email: z.string().email().min(1),
    password: z.string().min(1),
    contactNumber: z.string().min(1),
    // counter: z.string().min(1),
    name: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export type Schema = z.infer<typeof schema>;

export type EditSchema = Omit<Schema, 'password' | 'confirmPassword'> & {
  id: string;
};
