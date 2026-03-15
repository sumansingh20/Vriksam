// =============================================================================
// VRIKSHAM API - POST /api/auth/register
// =============================================================================
// Registers a new user account. Creates the user in MongoDB, hashes password,
// and returns user data with an access token.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/lib/models';
import { signToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, phone } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    // Create user (password is hashed by the pre-save hook in the schema)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || undefined,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      lastLoginAt: new Date(),
    });

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
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/auth/register error:', error);

    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    // Handle duplicate key error (race condition on unique email)
    if (error instanceof Error && 'code' in error && (error as Record<string, unknown>).code === 11000) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
