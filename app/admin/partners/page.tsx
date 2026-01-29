import { requireAdmin } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Partner from '@/models/Partner';
import Program from '@/models/Program';
import Link from 'next/link';
import { Handshake, MapPin, Users, Plus } from 'lucide-react';

export default async function AdminPartnersPage() {
  await requireAdmin();

  await connectDB();

  const partners = await Partner.find().sort({ createdAt: -1 }).lean();

  const programCounts = await Promise.all(
    partners.map((partner: any) =>
      Program.countDocuments({ partnerId: partner._id })
    )
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
            <p className="text-gray-600 mt-2">Manage organizations and partnerships</p>
          </div>
          <Link href="/admin/partners/new" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Link>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner: any, index: number) => (
          <div key={partner._id.toString()} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <Handshake className="w-8 h-8 text-primary-600" />
              )}
            </div>

            <div className="mb-4">
              <span className={`text-xs px-2 py-1 rounded ${
                partner.status === 'active' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {partner.status}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded ml-2 capitalize">
                {partner.type.replace('_', ' ')}
              </span>
            </div>

            <h3 className="font-bold text-lg mb-2">{partner.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {partner.description}
            </p>

            <div className="space-y-2 mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{partner.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{programCounts[index]} programs</span>
              </div>
            </div>

            <Link href={`/admin/partners/${partner._id}`} className="btn btn-primary w-full">
              View Details
            </Link>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="card text-center py-12">
          <Handshake className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first partner organization</p>
          <Link href="/admin/partners/new" className="btn btn-primary">
            Add Partner
          </Link>
        </div>
      )}
    </div>
  );
}
