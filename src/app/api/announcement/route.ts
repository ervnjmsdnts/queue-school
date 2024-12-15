import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function uploadFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

  const result = await new Promise<{ url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: resourceType },
          function (error, result) {
            if (error || result === undefined) {
              reject(error || new Error('Upload result is undefined'));
              return;
            }
            console.log({ result });
            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  return { url: result.url, name: file.name, publicId: result.public_id };
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.formData();

    const id = payload.get('id') as string;
    const title = payload.get('title') as string;
    const description = payload.get('description') as string;
    const image = payload.get('image') as File | null;
    const video = payload.get('video') as File | null;

    const data: Record<string, string | number | boolean> = {
      title,
      description,
    };
    if (video) {
      const file = video as File;
      const { url, name, publicId } = await uploadFile(file);
      data.videoUrl = url;
      data.videoName = name;
      data.videoPublicId = publicId;
    }
    if (image) {
      const file = image as File;
      const { url, name } = await uploadFile(file);
      data.imageUrl = url;
      data.imageName = name;
    }

    await updateDoc(doc(db, 'announcements', `${id}`), data);

    return NextResponse.json({ message: 'Added Announcement' });
  } catch (error) {
    console.log({ server: error });
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.formData();

    const title = payload.get('title') as string;
    const description = payload.get('description') as string;
    const image = payload.get('image') as File | null;
    const video = payload.get('video') as File | null;

    const data: Record<string, string | number | boolean> = {
      createdAt: new Date().getTime(),
      isActive: true,
      title,
      description,
    };
    if (video) {
      const file = video as File;
      const { url, name, publicId } = await uploadFile(file);
      data.videoUrl = url;
      data.videoName = name;
      data.videoPublicId = publicId;
    }
    if (image) {
      const file = image as File;
      const { url, name } = await uploadFile(file);
      data.imageUrl = url;
      data.imageName = name;
    }

    await addDoc(collection(db, 'announcements'), data);

    return NextResponse.json({ message: 'Added Announcement' });
  } catch (error) {
    console.log({ server: error });
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
