import { z } from 'zod';

export const schema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export type Schema = z.infer<typeof schema>;
