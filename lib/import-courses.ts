import fs from 'fs';
import Papa from 'papaparse';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';
import User from '@/models/User';
import { CourseStatus, CourseLevel, LessonType } from '@/models';

interface CourseCSVRow {
  title: string;
  description?: string;
  level: string;
  category: string;
  duration?: number;
  instructorEmail: string;
  tags?: string; // comma-separated
  status?: string;
}

interface LessonCSVRow {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonType: string;
  description?: string;
  contentUrl?: string;
  duration?: number;
  order?: number;
}

/**
 * Import courses from CSV
 * CSV format: title, description, level, category, duration, instructorEmail, tags, status
 */
export async function importCoursesFromCSV(filePath: string): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    await connectDB();

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse<CourseCSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    for (const row of parsed.data) {
      try {
        if (!row.title || !row.instructorEmail) {
          results.errors.push(`Missing required fields for ${row.title || 'unknown'}`);
          results.failed++;
          continue;
        }

        // Find instructor
        const instructor = await User.findOne({ email: row.instructorEmail });
        if (!instructor) {
          results.errors.push(`Instructor not found: ${row.instructorEmail}`);
          results.failed++;
          continue;
        }

        // Generate slug
        const slug = row.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Parse tags
        const tags = row.tags
          ? row.tags.split(',').map((t) => t.trim())
          : [];

        // Create course
        await Course.create({
          title: row.title,
          slug,
          description: row.description,
          level: (row.level as CourseLevel) || CourseLevel.BEGINNER,
          category: row.category,
          duration: row.duration ? parseInt(row.duration.toString()) : undefined,
          tags,
          createdBy: instructor._id,
          instructors: [instructor._id],
          status: (row.status as CourseStatus) || CourseStatus.DRAFT,
          modules: [],
          totalLessons: 0,
          totalQuizzes: 0,
          enrollmentCount: 0,
          completionCount: 0,
          isPublic: true,
          certificateEnabled: true,
          passThreshold: 70,
        });

        results.success++;
      } catch (error: any) {
        results.errors.push(`Error creating course ${row.title}: ${error.message}`);
        results.failed++;
      }
    }
  } catch (error: any) {
    results.errors.push(`File processing error: ${error.message}`);
  }

  return results;
}

/**
 * Import lessons from CSV (courses and modules must exist)
 * CSV format: courseTitle, moduleTitle, lessonTitle, lessonType, description, contentUrl, duration, order
 */
export async function importLessonsFromCSV(filePath: string): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    await connectDB();

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse<LessonCSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    for (const row of parsed.data) {
      try {
        if (!row.courseTitle || !row.moduleTitle || !row.lessonTitle) {
          results.errors.push(`Missing required fields`);
          results.failed++;
          continue;
        }

        // Find course
        const course = await Course.findOne({ title: row.courseTitle });
        if (!course) {
          results.errors.push(`Course not found: ${row.courseTitle}`);
          results.failed++;
          continue;
        }

        // Find or create module
        let module = await Module.findOne({
          courseId: course._id,
          title: row.moduleTitle,
        });

        if (!module) {
          const maxOrder = await Module.findOne({ courseId: course._id })
            .sort({ order: -1 })
            .select('order')
            .lean();

          module = await Module.create({
            courseId: course._id,
            title: row.moduleTitle,
            order: maxOrder ? maxOrder.order + 1 : 0,
            lessons: [],
            isPublished: false,
          });

          await Course.findByIdAndUpdate(course._id, {
            $push: { modules: module._id },
          });
        }

        // Create lesson
        const order = row.order
          ? parseInt(row.order.toString())
          : module.lessons.length;

        const lesson = await Lesson.create({
          moduleId: module._id,
          title: row.lessonTitle,
          description: row.description,
          type: (row.lessonType as LessonType) || LessonType.TEXT,
          order,
          content: {
            text: row.lessonType === 'text' ? row.description : undefined,
            externalUrl: row.contentUrl,
          },
          duration: row.duration ? parseInt(row.duration.toString()) : undefined,
          isPreview: false,
          isPublished: false,
          resources: [],
        });

        await Module.findByIdAndUpdate(module._id, {
          $push: { lessons: lesson._id },
        });

        results.success++;
      } catch (error: any) {
        results.errors.push(`Error creating lesson ${row.lessonTitle}: ${error.message}`);
        results.failed++;
      }
    }
  } catch (error: any) {
    results.errors.push(`File processing error: ${error.message}`);
  }

  return results;
}

/**
 * Generate CSV templates
 */
export function generateCourseCSVTemplate(outputPath: string): void {
  const headers = [
    'title',
    'description',
    'level',
    'category',
    'duration',
    'instructorEmail',
    'tags',
    'status',
  ];

  const exampleData = [
    {
      title: 'Introduction to Web Development',
      description: 'Learn the basics of web development',
      level: 'beginner',
      category: 'Technology',
      duration: 120,
      instructorEmail: 'instructor@example.com',
      tags: 'web,programming,beginner',
      status: 'published',
    },
  ];

  const csv = Papa.unparse({ fields: headers, data: exampleData });
  fs.writeFileSync(outputPath, csv);
  console.log(`Course CSV template generated at ${outputPath}`);
}

export function generateLessonCSVTemplate(outputPath: string): void {
  const headers = [
    'courseTitle',
    'moduleTitle',
    'lessonTitle',
    'lessonType',
    'description',
    'contentUrl',
    'duration',
    'order',
  ];

  const exampleData = [
    {
      courseTitle: 'Introduction to Web Development',
      moduleTitle: 'Getting Started',
      lessonTitle: 'What is Web Development?',
      lessonType: 'text',
      description: 'An introduction to web development concepts',
      contentUrl: '',
      duration: 10,
      order: 0,
    },
  ];

  const csv = Papa.unparse({ fields: headers, data: exampleData });
  fs.writeFileSync(outputPath, csv);
  console.log(`Lesson CSV template generated at ${outputPath}`);
}

export default {
  importCoursesFromCSV,
  importLessonsFromCSV,
  generateCourseCSVTemplate,
  generateLessonCSVTemplate,
};
