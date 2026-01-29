import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Module from '@/models/Module';
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit, Plus, BookOpen, GraduationCap, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CourseStatus } from '@/models';

interface CourseDetailPageProps {
  params: { id: string };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const user = await requireAuth();

  await connectDB();

  const course = await Course.findById(params.id)
    .populate('modules')
    .lean();

  if (!course) {
    notFound();
  }

  // Check if user is the creator or instructor
  const isOwner = course.createdBy.toString() === user.id;
  const isInstructor = course.instructors.some(
    (instructor: any) => instructor.toString() === user.id
  );

  if (!isOwner && !isInstructor) {
    notFound();
  }

  const modules = await Module.find({ courseId: params.id })
    .sort({ order: 1 })
    .lean();

  const serializedCourse = {
    ...course,
    _id: course._id.toString(),
    createdBy: course.createdBy.toString(),
    instructors: course.instructors.map((i: any) => i.toString()),
    modules: course.modules.map((m: any) => m.toString()),
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  };

  const serializedModules = modules.map(module => ({
    ...module,
    _id: module._id.toString(),
    courseId: module.courseId.toString(),
    lessons: module.lessons.map((l: any) => l.toString()),
    createdAt: module.createdAt.toISOString(),
    updatedAt: module.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <Link
          href="/facilitator/courses"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>
      </div>

      {/* Course Header */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {serializedCourse.thumbnail ? (
            <div className="relative w-full lg:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={serializedCourse.thumbnail}
                alt={serializedCourse.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full lg:w-64 h-48 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-16 h-16 text-white opacity-50" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      serializedCourse.status === CourseStatus.PUBLISHED
                        ? 'bg-green-100 text-green-800'
                        : serializedCourse.status === CourseStatus.DRAFT
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {serializedCourse.status}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-primary-100 text-primary-800">
                    {serializedCourse.level}
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    {serializedCourse.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {serializedCourse.title}
                </h1>
                {serializedCourse.description && (
                  <p className="text-gray-600">{serializedCourse.description}</p>
                )}
              </div>
              <Link
                href={`/facilitator/courses/${params.id}/edit`}
                className="btn btn-secondary ml-4"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">
                    {serializedCourse.duration ? `${serializedCourse.duration} min` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Enrolled</p>
                  <p className="font-semibold">{serializedCourse.enrollmentCount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Lessons</p>
                  <p className="font-semibold">{serializedCourse.totalLessons || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Pass Rate</p>
                  <p className="font-semibold">{serializedCourse.passThreshold}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      {serializedCourse.learningObjectives && serializedCourse.learningObjectives.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Objectives</h2>
          <ul className="space-y-2">
            {serializedCourse.learningObjectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">✓</span>
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prerequisites */}
      {serializedCourse.prerequisites && serializedCourse.prerequisites.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
          <ul className="space-y-2">
            {serializedCourse.prerequisites.map((prereq: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span className="text-gray-700">{prereq}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course Modules */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
          <Link
            href={`/facilitator/courses/${params.id}/modules/new`}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Link>
        </div>

        {serializedModules.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Modules Yet</h3>
            <p className="text-gray-600 mb-6">Add your first module to start building course content</p>
            <Link
              href={`/facilitator/courses/${params.id}/modules/new`}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {serializedModules.map((module, index) => (
              <Link
                key={module._id}
                href={`/facilitator/courses/${params.id}/modules/${module._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {module.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{module.lessons.length} lessons</span>
                      {module.duration && <span>{module.duration} minutes</span>}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          module.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {module.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
