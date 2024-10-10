import { z } from 'zod';

export const schema = z.object({
  scheduleDate: z.string().min(1),
  counter: z.coerce.number().min(1),
  type: z.string().min(1),
});

export type Schema = z.infer<typeof schema>;
