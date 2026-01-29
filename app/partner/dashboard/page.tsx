import { requireAuth } from '@/lib/auth-helpers';
import { GraduationCap, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function PartnerDashboardPage() {
  const user = await requireAuth();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your programs and track learner progress</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Learners</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completions</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card text-center py-12">
        <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Programs Yet</h3>
        <p className="text-gray-600 mb-6">Create your first program to start training learners</p>
        <Link href="/partner/programs/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Program
        </Link>
      </div>
    </div>
  );
}
