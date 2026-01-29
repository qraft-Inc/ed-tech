import { requireAuth } from '@/lib/auth-helpers';
import { BarChart3 } from 'lucide-react';

export default async function PartnerAnalyticsPage() {
  const user = await requireAuth();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track program performance and learner progress</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600 mb-2">Total Enrollments</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-2">Active Learners</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
          <p className="text-3xl font-bold">0%</p>
        </div>
      </div>

      <div className="card text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Analytics will appear once learners start enrolling</p>
      </div>
    </div>
  );
}
