import { z } from 'zod';

export const schema = z
  .object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    contactNumber: z.string().min(10).max(10),
    password: z.string().min(1),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export type Schema = z.infer<typeof schema>;
