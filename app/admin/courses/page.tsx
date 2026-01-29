import { requireAdmin } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import Link from 'next/link';
import { BookOpen, Users, Eye, Plus } from 'lucide-react';

export default async function AdminCoursesPage() {
  await requireAdmin();

  await connectDB();

  const courses = await Course.find().sort({ createdAt: -1 }).lean();

  const enrollmentCounts = await Promise.all(
    courses.map((course: any) =>
      Enrollment.countDocuments({ courseId: course._id })
    )
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600 mt-2">Manage all courses on the platform</p>
          </div>
          <Link href="/admin/courses/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any, index: number) => (
          <div key={course._id.toString()} className="card hover:shadow-lg transition-shadow">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="mb-4">
              <span className={`text-xs px-2 py-1 rounded ${
                course.status === 'published' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {course.status}
              </span>
            </div>

            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{enrollmentCounts[index]} enrolled</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{course.level}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/courses/${course._id}`} className="btn btn-primary flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Link>
              <Link href={`/admin/courses/${course._id}/edit`} className="btn btn-outline">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
