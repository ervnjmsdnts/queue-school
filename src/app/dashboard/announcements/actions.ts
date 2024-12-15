import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Schema } from './schema';
import { db } from '@/lib/firebase';

export async function addAnnouncement(payload: Schema) {
  try {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.video) {
      formData.append('video', payload.video);
    }

    const res = await fetch('/api/announcement', {
      body: formData,
      method: 'POST',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error((data as Error).message || 'Failed');
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function editAnnouncement(payload: Schema & { id: string }) {
  try {
    const formData = new FormData();
    formData.append('id', payload.id);
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.video) {
      formData.append('video', payload.video);
    }

    const res = await fetch('/api/announcement', {
      body: formData,
      method: 'PUT',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error((data as Error).message || 'Failed');
    }

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function deleteAnnouncement(id: string) {
  await deleteDoc(doc(db, 'announcements', `${id}`));
}
