import { z } from 'zod';

export const schema = z.object({
  counterNum: z.coerce.number().min(1),
  description: z.string().optional(),
});

export type Schema = z.infer<typeof schema>;
