import { NextRequest, NextResponse } from 'next/server';

import admin from 'firebase-admin';

import { initAdmin } from '@/lib/firebase/admin';

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await initAdmin();
    const payload = await request.json();
    const user = await admin.auth().createUser({
      emailVerified: false,
      email: payload.email,
      password: payload.password,
      disabled: false,
    });

    await admin
      .firestore()
      .collection('users')
      .doc(`/${user.uid}/`)
      .create({ ...payload });

    return NextResponse.json({ message: 'DONE' });
  } catch (error) {
    console.log({ server: error });
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
