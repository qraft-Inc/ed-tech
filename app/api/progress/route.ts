import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-helpers';
import Enrollment from '@/models/Enrollment';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { enrollmentId, lessonId, completed, timeSpent, lastPosition } = body;
    
    await connectDB();
    
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId: user.id,
    });
    
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }
    
    // Find or create lesson progress
    let lessonProgress = enrollment.lessonProgress.find(
      (lp: any) => lp.lessonId.toString() === lessonId
    );
    
    if (!lessonProgress) {
      lessonProgress = {
        lessonId,
        completed: false,
        timeSpent: 0,
      };
      enrollment.lessonProgress.push(lessonProgress);
    }
    
    // Update lesson progress
    if (completed !== undefined) {
      lessonProgress.completed = completed;
      if (completed && !lessonProgress.completedAt) {
        lessonProgress.completedAt = new Date();
      }
    }
    
    if (timeSpent !== undefined) {
      lessonProgress.timeSpent += timeSpent;
      enrollment.totalTimeSpent += timeSpent;
    }
    
    if (lastPosition !== undefined) {
      lessonProgress.lastPosition = lastPosition;
    }
    
    enrollment.lastAccessedAt = new Date();
    
    // If this is the first lesson accessed, mark as started
    if (!enrollment.startedAt) {
      enrollment.startedAt = new Date();
    }
    
    // Update module progress
    const lesson = await Lesson.findById(lessonId);
    if (lesson) {
      const module = await Module.findById(lesson.moduleId).populate('lessons');
      
      if (module) {
        let moduleProgress = enrollment.moduleProgress.find(
          (mp: any) => mp.moduleId.toString() === module._id.toString()
        );
        
        if (!moduleProgress) {
          moduleProgress = {
            moduleId: module._id,
            lessonsCompleted: 0,
            totalLessons: module.lessons.length,
            progress: 0,
          };
          enrollment.moduleProgress.push(moduleProgress);
        }
        
        // Count completed lessons in this module
        const completedLessonsInModule = enrollment.lessonProgress.filter(
          (lp: any) =>
            lp.completed &&
            module.lessons.some((l: any) => l._id.toString() === lp.lessonId.toString())
        ).length;
        
        moduleProgress.lessonsCompleted = completedLessonsInModule;
        moduleProgress.progress = (completedLessonsInModule / module.lessons.length) * 100;
      }
    }
    
    // Calculate overall progress
    const totalLessons = enrollment.lessonProgress.length;
    const completedLessons = enrollment.lessonProgress.filter(
      (lp: any) => lp.completed
    ).length;
    enrollment.progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    await enrollment.save();
    
    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
