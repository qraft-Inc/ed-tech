import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import Link from 'next/link';
import { CourseStatus } from '@/models';

export default async function CoursesPage() {
  const user = await requireAuth();

  await connectDB();

  const [courses, enrollments] = await Promise.all([
    Course.find({ status: CourseStatus.PUBLISHED, isPublic: true })
      .populate('instructors', 'email')
      .sort({ enrollmentCount: -1 })
      .lean(),
    Enrollment.find({ userId: user.id }).select('courseId').lean(),
  ]);

  const enrolledCourseIds = new Set(
    enrollments.map((e: any) => e.courseId.toString())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
          <p className="text-gray-600 mt-2">
            Explore our collection of courses and start learning
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => {
            const isEnrolled = enrolledCourseIds.has(course._id.toString());
            
            return (
              <div key={course._id.toString()} className="card">
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg -mt-6 -mx-6 mb-4"
                  />
                )}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                    {course.level}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {course.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course.totalLessons} lessons</span>
                  <span>{course.enrollmentCount} students</span>
                </div>
                {isEnrolled ? (
                  <Link
                    href={`/courses/${course._id}`}
                    className="btn btn-primary w-full"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course._id}`}
                    className="btn btn-outline w-full"
                  >
                    View Course
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-600">No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
