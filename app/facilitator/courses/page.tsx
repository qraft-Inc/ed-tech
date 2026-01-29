import { requireAuth } from '@/lib/auth-helpers';
import { BookOpen, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function FacilitatorCoursesPage() {
  const user = await requireAuth();

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

      <div className="card text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
        <p className="text-gray-600 mb-6">Create your first course to start teaching</p>
        <Link href="/facilitator/courses/new" className="btn btn-primary">
          Create Course
        </Link>
      </div>
    </div>
  );
}
