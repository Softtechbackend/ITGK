import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Signed out successfully' },
      { status: 200 }
    );

    // Clear auth cookie
    response.cookies.set('sb-auth-token', '', {
      httpOnly: true,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: `Server error: ${error}` },
      { status: 500 }
    );
  }
}
