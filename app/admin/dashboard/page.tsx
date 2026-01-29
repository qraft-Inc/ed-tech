import { requireAdmin } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import Profile from '@/models/Profile';
import Partner from '@/models/Partner';
import { Users, BookOpen, Award, TrendingUp, UserCheck, Globe } from 'lucide-react';

export default async function AdminDashboardPage() {
  await requireAdmin();

  await connectDB();

  // Fetch analytics data
  const [
    totalUsers,
    totalLearners,
    totalCourses,
    totalEnrollments,
    activeEnrollments,
    completedEnrollments,
    totalPartners,
    recentEnrollments,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'learner' }),
    Course.countDocuments({ status: 'published' }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: 'active' }),
    Enrollment.countDocuments({ status: 'completed' }),
    Partner.countDocuments({ status: 'active' }),
    Enrollment.find()
      .sort({ enrolledAt: -1 })
      .limit(10)
      .populate('userId', 'email')
      .populate('courseId', 'title')
      .lean(),
  ]);

  // Calculate completion rate
  const completionRate = totalEnrollments > 0
    ? (completedEnrollments / totalEnrollments) * 100
    : 0;

  // Get gender breakdown
  const genderStats = await Profile.aggregate([
    {
      $group: {
        _id: '$gender',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get learner type breakdown
  const learnerTypeStats = await Profile.aggregate([
    {
      $group: {
        _id: '$learnerType',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get location breakdown
  const locationStats = await Profile.aggregate([
    {
      $group: {
        _id: '$district',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          System Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Platform overview and analytics
        </p>
      </div>

      <div>
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Learners</p>
                <p className="text-2xl font-bold">{activeEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published Courses</p>
                <p className="text-2xl font-bold">{totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Award className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Gender Breakdown */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Gender Distribution</h3>
            <div className="space-y-3">
              {genderStats.map((stat: any) => (
                <div key={stat._id || 'unknown'}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{stat._id || 'Not specified'}</span>
                    <span>{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(stat.count / totalLearners) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learner Types */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Learner Types</h3>
            <div className="space-y-3">
              {learnerTypeStats.map((stat: any) => (
                <div key={stat._id || 'unknown'}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{stat._id || 'Not specified'}</span>
                    <span>{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary-600 h-2 rounded-full"
                      style={{
                        width: `${(stat.count / totalLearners) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="card mb-8">
          <h3 className="font-bold text-lg mb-4">Top Districts</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationStats.map((stat: any) => (
              <div
                key={stat._id || 'unknown'}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{stat._id || 'Not specified'}</span>
                </div>
                <span className="text-gray-600">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Recent Enrollments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Learner</th>
                  <th className="text-left py-2 px-4">Course</th>
                  <th className="text-left py-2 px-4">Progress</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((enrollment: any) => (
                  <tr key={enrollment._id.toString()} className="border-b">
                    <td className="py-2 px-4">{enrollment.userId?.email}</td>
                    <td className="py-2 px-4">{enrollment.courseId?.title}</td>
                    <td className="py-2 px-4">{Math.round(enrollment.progress)}%</td>
                    <td className="py-2 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          enrollment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
