import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-helpers';
import Course from '@/models/Course';
import { z } from 'zod';
import { CourseStatus, CourseLevel, UserRole } from '@/models';

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  duration: z.number().optional(),
  language: z.string().optional(),
  thumbnail: z.string().optional(),
  passThreshold: z.number().min(0).max(100).optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    
    let query: any = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }
    
    const courses = await Course.find(query)
      .populate('createdBy', 'email')
      .populate('instructors', 'email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only facilitators and admins can create courses
    if (![UserRole.FACILITATOR, UserRole.PARTNER_ADMIN, UserRole.SYSTEM_ADMIN].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await req.json();
    const validatedData = courseSchema.parse(body);
    
    await connectDB();
    
    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const course = await Course.create({
      ...validatedData,
      slug,
      createdBy: user.id,
      instructors: [user.id],
      status: CourseStatus.DRAFT,
      isPublic: false,
      certificateEnabled: true,
      modules: [],
      totalLessons: 0,
      totalQuizzes: 0,
      enrollmentCount: 0,
      completionCount: 0,
    });
    
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
