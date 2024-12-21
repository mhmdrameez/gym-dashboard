import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    // Delete cookie by name only (no options needed)
    (await
          // Delete cookie by name only (no options needed)
          cookieStore).delete('token');  

    // Create response with proper headers
    const response = NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );

    // Ensure cookie is cleared in response
    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(0)  // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}
