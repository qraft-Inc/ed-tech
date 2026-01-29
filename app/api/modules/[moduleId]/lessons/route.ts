import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-helpers';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';
import { z } from 'zod';

const lessonSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(['video', 'text', 'audio', 'pdf', 'interactive', 'quiz']),
  order: z.number().optional(),
  content: z.object({
    text: z.string().optional(),
    video: z.object({
      cloudinaryId: z.string(),
      url: z.string(),
      duration: z.number(),
      thumbnail: z.string().optional(),
      subtitles: z.array(z.object({
        language: z.string(),
        url: z.string(),
      })).optional(),
      qualities: z.array(z.object({
        quality: z.string(),
        url: z.string(),
        bandwidth: z.number(),
      })).optional(),
    }).optional(),
    audio: z.object({
      cloudinaryId: z.string(),
      url: z.string(),
      duration: z.number(),
      transcript: z.string().optional(),
    }).optional(),
    pdf: z.object({
      cloudinaryId: z.string(),
      url: z.string(),
      pageCount: z.number().optional(),
    }).optional(),
    externalUrl: z.string().optional(),
  }),
  duration: z.number().optional(),
  isPreview: z.boolean().optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const module = await Module.findById(params.moduleId);
    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    
    const body = await req.json();
    const validatedData = lessonSchema.parse(body);
    
    // Get the next order number
    const maxOrder = await Lesson.findOne({ moduleId: params.moduleId })
      .sort({ order: -1 })
      .select('order')
      .lean();
    
    const order = validatedData.order ?? (maxOrder ? maxOrder.order + 1 : 0);
    
    const lesson = await Lesson.create({
      moduleId: params.moduleId,
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type,
      order,
      content: validatedData.content,
      duration: validatedData.duration,
      isPreview: validatedData.isPreview || false,
      resources: validatedData.resources || [],
      isPublished: false,
    });
    
    // Add lesson to module
    await Module.findByIdAndUpdate(params.moduleId, {
      $push: { lessons: lesson._id },
    });
    
    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Create lesson error:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
