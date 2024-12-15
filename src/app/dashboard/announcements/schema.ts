import { z } from 'zod';

const IMAGE_ACCEPTED_TYPES = ['image/png', 'image/jpeg'];
const MAX_IMAGE_FILE_SIZE = 15000000;

const VIDEO_ACCEPTED_TYPES = ['video/mp4', 'video/quicktime']; // Adjust as needed
const MAX_VIDEO_FILE_SIZE = 15000000; // e.g., 15MB

const videoSchema = z
  .any()
  .optional()
  .refine(
    (file) =>
      file && file.length === 1
        ? VIDEO_ACCEPTED_TYPES.includes(file[0]?.type)
        : true,
    'Invalid file. Please choose an MP4 or MOV file.',
  )
  .refine(
    (file) =>
      file && file.length === 1 ? file[0]?.size <= MAX_VIDEO_FILE_SIZE : true,
    'Max file size allowed is 15MB.',
  );

const imageSchema = z
  .any()
  .optional()
  .refine(
    (file) =>
      file && file.length === 1
        ? IMAGE_ACCEPTED_TYPES.includes(file?.[0]?.type)
          ? true
          : false
        : true,
    'Invalid file. choose JPG or PNG.',
  )
  .refine(
    (file) =>
      file && file.length === 1
        ? file[0]?.size <= MAX_IMAGE_FILE_SIZE
          ? true
          : false
        : true,
    'Max file size allowed is 15MB.',
  );

export const schema = z.object({
  image: imageSchema.optional(),
  video: videoSchema.optional(),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type Schema = z.infer<typeof schema>;
