import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import Link from 'next/link';
import { BookOpen, Clock, Award } from 'lucide-react';

export default async function LearnerCoursesPage() {
  const user = await requireAuth();

  await connectDB();

  const enrollments = await Enrollment.find({ userId: user.id })
    .populate('courseId')
    .sort({ lastAccessedAt: -1 })
    .lean();

  const activeEnrollments = enrollments.filter((e: any) => e.status === 'active');
  const completedEnrollments = enrollments.filter((e: any) => e.status === 'completed');

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Manage and track your learning journey</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button className="pb-4 px-1 border-b-2 border-primary-600 text-primary-600 font-medium">
            Active ({activeEnrollments.length})
          </button>
          <button className="pb-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            Completed ({completedEnrollments.length})
          </button>
        </div>
      </div>

      {/* Active Courses */}
      {activeEnrollments.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEnrollments.map((enrollment: any) => (
            <Link
              key={enrollment._id.toString()}
              href={`/courses/${enrollment.courseId._id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              {enrollment.courseId.thumbnail && (
                <img
                  src={enrollment.courseId.thumbnail}
                  alt={enrollment.courseId.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-bold text-lg mb-2">{enrollment.courseId.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {enrollment.courseId.description}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4 mr-1" />
                <span>Last accessed: {new Date(enrollment.lastAccessedAt).toLocaleDateString()}</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{Math.round(enrollment.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full">Continue Learning</button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Courses</h3>
          <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
          <Link href="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
