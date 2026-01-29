import { requireAdmin } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import Profile from '@/models/Profile';
import { BarChart3, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  await connectDB();

  // Get time-based metrics
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers30d,
    newUsers7d,
    totalEnrollments,
    newEnrollments30d,
    activeEnrollments,
    completedEnrollments,
    totalCourses,
    publishedCourses,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: last30Days } }),
    User.countDocuments({ createdAt: { $gte: last7Days } }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ enrolledAt: { $gte: last30Days } }),
    Enrollment.countDocuments({ status: 'active' }),
    Enrollment.countDocuments({ status: 'completed' }),
    Course.countDocuments(),
    Course.countDocuments({ status: 'published' }),
  ]);

  const completionRate = totalEnrollments > 0 
    ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1) 
    : 0;

  // User growth by role
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Top courses
  const topCourses = await Enrollment.aggregate([
    { $group: { _id: '$courseId', enrollments: { $sum: 1 } } },
    { $sort: { enrollments: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' }
  ]);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600 mt-2">Comprehensive insights and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Users</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{totalUsers}</p>
          <p className="text-sm text-green-600">+{newUsers7d} this week</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Enrollments</p>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{totalEnrollments}</p>
          <p className="text-sm text-green-600">+{newEnrollments30d} this month</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Learners</p>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{activeEnrollments}</p>
          <p className="text-sm text-gray-600">Currently learning</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mb-1">{completionRate}%</p>
          <p className="text-sm text-gray-600">{completedEnrollments} completed</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Users by Role */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Users by Role</h3>
          <div className="space-y-4">
            {usersByRole.map((item: any) => (
              <div key={item._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item._id.replace('_', ' ')}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(item.count / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Top Courses by Enrollment</h3>
          <div className="space-y-3">
            {topCourses.map((item: any, index: number) => (
              <div key={item._id.toString()} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{item.course.title}</p>
                    <p className="text-sm text-gray-600">{item.enrollments} enrollments</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Course Overview</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Courses</p>
            <p className="text-2xl font-bold">{totalCourses}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Published</p>
            <p className="text-2xl font-bold text-green-600">{publishedCourses}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">{totalCourses - publishedCourses}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
