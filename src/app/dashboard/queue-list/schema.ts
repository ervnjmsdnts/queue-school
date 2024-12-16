import { z } from 'zod';

export const schema = z.object({
  scheduleDate: z.string().min(1),
  type: z.string().min(1),
  customerName: z.string().min(1),
  customerContact: z.string().min(10).max(10),
});

export type Schema = z.infer<typeof schema>;
