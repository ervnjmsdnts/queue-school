import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const url = 'https://semaphore.co/api/v4/messages';
    const params = new URLSearchParams({
      apikey: process.env.NEXT_PUBLIC_SEMAPHORE_API_KEY!,
      number: `63${payload.contactNumber}`,
      message: payload.message,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Something went wrong when generating a new OTP code' },
        { status: 500 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log({ server: error });
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
}
