import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-helpers';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import { EnrollmentStatus } from '@/models';

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
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: user.id,
      courseId: params.id,
    });
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: user.id,
      courseId: params.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 0,
      moduleProgress: [],
      lessonProgress: [],
      totalTimeSpent: 0,
      certificateIssued: false,
    });
    
    // Update course enrollment count
    await Course.findByIdAndUpdate(params.id, {
      $inc: { enrollmentCount: 1 },
    });
    
    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error('Enroll course error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const enrollment = await Enrollment.findOne({
      userId: user.id,
      courseId: params.id,
    })
      .populate('courseId')
      .lean();
    
    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('Get enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment' },
      { status: 500 }
    );
  }
}
