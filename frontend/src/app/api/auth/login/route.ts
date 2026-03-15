// =============================================================================
// VRIKSHAM API - POST /api/auth/login
// =============================================================================
// Authenticates a user with email and password, returns user data and tokens.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, type IUserDocument } from '@/lib/models';
import { signToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Find user by email (include password field for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }) as IUserDocument | null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Check if user is suspended or inactive
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated. Please contact support.' },
        { status: 403 },
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // Generate tokens
    const accessToken = signToken(user._id.toString(), user.role);
    const refreshToken = signRefreshToken(user._id.toString(), user.role);

    // Return user (without password) and tokens
    const userResponse = user.toJSON();

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
        accessToken,
        refreshToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] POST /api/auth/login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
