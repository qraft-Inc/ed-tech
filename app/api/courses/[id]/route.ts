import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-helpers';
import Course from '@/models/Course';
import Module from '@/models/Module';
import Enrollment from '@/models/Enrollment';
import { UserRole } from '@/models';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const course = await Course.findById(params.id)
      .populate('createdBy', 'email')
      .populate('instructors', 'email')
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
        },
      })
      .lean();
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const isAdmin = [UserRole.PARTNER_ADMIN, UserRole.SYSTEM_ADMIN].includes(user.role);
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await req.json();
    
    Object.assign(course, body);
    await course.save();
    
    return NextResponse.json({ course });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const isAdmin = user.role === UserRole.SYSTEM_ADMIN;
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if course has enrollments
    const enrollmentCount = await Enrollment.countDocuments({ courseId: params.id });
    if (enrollmentCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course with active enrollments' },
        { status: 400 }
      );
    }
    
    // Delete associated modules and lessons
    await Module.deleteMany({ courseId: params.id });
    
    await course.deleteOne();
    
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
