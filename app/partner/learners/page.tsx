import { requireAuth } from '@/lib/auth-helpers';
import { Users, Search } from 'lucide-react';

export default async function PartnerLearnersPage() {
  const user = await requireAuth();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learners</h1>
        <p className="text-gray-600 mt-2">View and manage learners in your programs</p>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search learners..."
            className="input pl-10 w-full"
          />
        </div>
      </div>

      <div className="card text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Learners Yet</h3>
        <p className="text-gray-600">Learners will appear here once they join your programs</p>
      </div>
    </div>
  );
}
