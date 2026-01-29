import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-helpers';
import Course from '@/models/Course';
import Module from '@/models/Module';
import { z } from 'zod';
import { UserRole } from '@/models';

const moduleSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  order: z.number().optional(),
  duration: z.number().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const course = await Course.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    // Check permissions
    const isCreator = course.createdBy.toString() === user.id;
    const isInstructor = course.instructors.some((id: any) => id.toString() === user.id);
    const isAdmin = [UserRole.PARTNER_ADMIN, UserRole.SYSTEM_ADMIN].includes(user.role);
    
    if (!isCreator && !isInstructor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await req.json();
    const validatedData = moduleSchema.parse(body);
    
    // Get the next order number
    const maxOrder = await Module.findOne({ courseId: params.id })
      .sort({ order: -1 })
      .select('order')
      .lean();
    
    const order = validatedData.order ?? (maxOrder ? maxOrder.order + 1 : 0);
    
    const module = await Module.create({
      courseId: params.id,
      title: validatedData.title,
      description: validatedData.description,
      order,
      duration: validatedData.duration,
      lessons: [],
      isPublished: false,
    });
    
    // Add module to course
    await Course.findByIdAndUpdate(params.id, {
      $push: { modules: module._id },
    });
    
    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Create module error:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const modules = await Module.find({ courseId: params.id })
      .sort({ order: 1 })
      .populate('lessons')
      .lean();
    
    return NextResponse.json({ modules });
  } catch (error) {
    console.error('Get modules error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}
