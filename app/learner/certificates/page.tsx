import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';
import Course from '@/models/Course';
import Link from 'next/link';
import { Award, Download, Share2, Calendar } from 'lucide-react';

export default async function LearnerCertificatesPage() {
  const user = await requireAuth();

  await connectDB();

  const certificates = await Certificate.find({ userId: user.id })
    .populate('courseId')
    .sort({ issuedAt: -1 })
    .lean();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-2">View and download your earned certificates</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert: any) => (
            <div key={cert._id.toString()} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4 mx-auto">
                <Award className="w-8 h-8 text-secondary-600" />
              </div>

              <h3 className="font-bold text-lg text-center mb-2">
                {cert.courseId?.title || 'Course Certificate'}
              </h3>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="text-xs font-mono text-gray-900">{cert.certificateId}</p>
              </div>

              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/certificates/${cert._id}`}
                  className="btn btn-primary flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  View
                </Link>
                <button className="btn btn-outline">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
          <p className="text-gray-600 mb-6">
            Complete courses to earn certificates
          </p>
          <Link href="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}
