import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import Profile from '@/models/Profile';
import Link from 'next/link';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';

export default async function LearnerDashboardPage() {
  const user = await requireAuth();

  await connectDB();

  const [enrollments, profile] = await Promise.all([
    Enrollment.find({ userId: user.id })
      .populate('courseId')
      .sort({ lastAccessedAt: -1 })
      .lean(),
    Profile.findOne({ userId: user.id }).lean(),
  ]);

  const activeEnrollments = enrollments.filter((e: any) => e.status === 'active');
  const completedEnrollments = enrollments.filter((e: any) => e.status === 'completed');
  
  const totalTimeSpent = enrollments.reduce((acc: number, e: any) => acc + (e.totalTimeSpent || 0), 0);
  const avgProgress = enrollments.length > 0
    ? enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) / enrollments.length
    : 0;

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">Track your learning progress and continue your courses</p>
      </div>

      <div>
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold">{activeEnrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Award className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedEnrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold">
                  {Math.round(totalTimeSpent / 3600)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold">{Math.round(avgProgress)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {activeEnrollments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
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
                      className="w-full h-48 object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
                    />
                  )}
                  <h3 className="font-bold text-lg mb-2">
                    {enrollment.courseId.title}
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary w-full">
                    Continue Course
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Browse Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Explore More Courses</h2>
            <Link href="/courses" className="text-primary-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Discover new skills and advance your career
            </p>
            <Link href="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
