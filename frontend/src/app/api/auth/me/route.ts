// =============================================================================
// VRIKSHAM API - GET /api/auth/me
// =============================================================================
// Returns the current authenticated user's profile (without password).
// Requires a valid Bearer token in the Authorization header.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please provide a valid access token.' },
        { status: 401 },
      );
    }

    // Fetch fresh user data with full profile (excluding sensitive fields)
    const fullUser = await User.findById(user._id).select('-password -refreshTokens -__v');

    if (!fullUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: fullUser.toJSON(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/auth/me error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
