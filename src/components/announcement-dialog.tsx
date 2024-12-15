'use client';
import { Announcement } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

export default function AnnouncementDialog({
  announcement,
  handleClose,
}: {
  announcement: Announcement | null;
  handleClose: () => void;
}) {
  return (
    <Dialog open={Boolean(announcement)} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{announcement?.title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-2 max-h-60 overflow-y-auto h-full'>
          {announcement && announcement.imageUrl && (
            <CldImage
              alt='image'
              src={announcement.imageUrl}
              style={{ width: '100%' }}
              className='rounded-lg'
              width={1000}
              height={500}
            />
          )}
          {announcement && announcement.videoPublicId && (
            <CldVideoPlayer
              src={announcement.videoPublicId}
              className='rounded-lg'
              width={1000}
              height={500}
            />
          )}
          <p>{announcement?.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
