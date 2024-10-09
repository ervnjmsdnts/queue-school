import { NextRequest, NextResponse } from 'next/server';

import admin from 'firebase-admin';

import { initAdmin } from '@/lib/firebase/admin';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await initAdmin();
    const payload = await request.json();
    const currUser = (
      await admin
        .firestore()
        .collection('users')
        .doc(`/${payload.userId}/`)
        .get()
    ).data();

    if (!currUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (currUser.password !== payload.currentPassword) {
      return NextResponse.json(
        { message: 'Incorrect old password' },
        { status: 400 },
      );
    }

    const user = await admin.auth().updateUser(payload.userId, {
      password: payload.newPassword,
    });

    await admin
      .firestore()
      .collection('users')
      .doc(`/${user.uid}/`)
      .update({ password: payload.newPassword });

    return NextResponse.json({ message: 'DONE' });
  } catch (error) {
    console.log({ server: error });
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
