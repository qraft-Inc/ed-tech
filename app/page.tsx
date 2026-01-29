import Link from 'next/link';
import { GraduationCap, Users, TrendingUp, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="https://res.cloudinary.com/dwa3soopc/image/upload/v1741594460/8_zziqf2.png" 
                alt="Qraft Academy" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">
                Qraft Academy
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/signin" className="btn btn-outline">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Inclusive Learning
            <span className="text-primary-600"> for Everyone</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering underserved communities in Uganda with quality digital
            education. Learn skills, earn certificates, and transform your
            future.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-3">
              Start Learning Free
            </Link>
            <Link href="/courses" className="btn btn-outline text-lg px-8 py-3">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card text-center">
            <GraduationCap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Quality Courses</h3>
            <p className="text-gray-600">
              Professional training in digital skills, entrepreneurship, and
              more
            </p>
          </div>
          <div className="card text-center">
            <Users className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Community First</h3>
            <p className="text-gray-600">
              Built for refugees, youth, and workers in low-resource settings
            </p>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor learning outcomes and earn recognized certificates
            </p>
          </div>
          <div className="card text-center">
            <Globe className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Accessible</h3>
            <p className="text-gray-600">
              Mobile-first, low-bandwidth, with captions and screen reader
              support
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-primary-100 mt-2">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-primary-100 mt-2">Quality Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold">85%</div>
              <div className="text-primary-100 mt-2">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="w-6 h-6" />
              <span className="text-xl font-bold">Qraft Academy</span>
            </div>
            <p className="text-gray-400">
              Transforming lives through inclusive digital education
            </p>
            <p className="text-gray-500 mt-4 text-sm">
              © 2026 Qraft Academy. Built for impact in Uganda.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
