import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import { UserRole } from '@/models';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  country: z.string().optional(),
  district: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: hashedPassword,
      phone: validatedData.phone,
      role: UserRole.LEARNER,
      isActive: true,
      emailVerified: false,
    });

    // Create profile
    await Profile.create({
      userId: user._id,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      country: validatedData.country || 'Uganda',
      district: validatedData.district,
      accessibilityPreferences: {
        fontSize: 'medium',
        enableCaptions: true,
        enableScreenReader: false,
        highContrast: false,
        reducedMotion: false,
      },
      lowBandwidthMode: false,
      language: 'en',
      timezone: 'Africa/Kampala',
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
