import { requireAuth } from '@/lib/auth-helpers';
import { BookOpen, Plus, Clock, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { CourseStatus } from '@/models';
import Image from 'next/image';

export default async function FacilitatorCoursesPage() {
  const user = await requireAuth();

  await connectDB();
  
  // Fetch courses created by this facilitator
  const courses = await Course.find({
    createdBy: user.id,
  })
    .sort({ createdAt: -1 })
    .select('title slug description thumbnail status level category enrollmentCount totalLessons duration createdAt')
    .lean();

  const serializedCourses = courses.map(course => ({
    ...course,
    _id: course._id.toString(),
    createdAt: course.createdAt.toISOString(),
  }));

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Manage and create your courses</p>
          </div>
          <Link href="/facilitator/courses/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Link>
        </div>
      </div>

      {serializedCourses.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-600 mb-6">Create your first course to start teaching</p>
          <Link href="/facilitator/courses/new" className="btn btn-primary">
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedCourses.map((course) => (
            <Link
              key={course._id}
              href={`/facilitator/courses/${course._id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              {course.thumbnail ? (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 mb-4 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white opacity-50" />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        course.status === CourseStatus.PUBLISHED
                          ? 'bg-green-100 text-green-800'
                          : course.status === CourseStatus.DRAFT
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {course.status}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {course.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {course.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{course.totalLessons || 0} lessons</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
