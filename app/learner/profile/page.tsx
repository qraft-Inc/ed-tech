import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Profile from '@/models/Profile';
import User from '@/models/User';
import { User as UserIcon, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default async function LearnerProfilePage() {
  const user = await requireAuth();

  await connectDB();

  const [profile, userDoc] = await Promise.all([
    Profile.findOne({ userId: user.id }).lean(),
    User.findById(user.id).lean(),
  ]);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12 text-primary-600" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-gray-600 text-sm mb-4 capitalize">{userDoc?.role?.replace('_', ' ')}</p>
            <button className="btn btn-outline w-full">Edit Profile</button>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userDoc?.email}</p>
                </div>
              </div>

              {profile?.phone && (
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">
                    {profile?.district}, {profile?.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(userDoc?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demographics */}
          {profile && (
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Demographics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.gender && (
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium capitalize">{profile.gender}</p>
                  </div>
                )}
                {profile.ageRange && (
                  <div>
                    <p className="text-sm text-gray-600">Age Range</p>
                    <p className="font-medium">{profile.ageRange}</p>
                  </div>
                )}
                {profile.learnerType && (
                  <div>
                    <p className="text-sm text-gray-600">Learner Type</p>
                    <p className="font-medium capitalize">{profile.learnerType.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accessibility Preferences */}
          {profile?.accessibilityPreferences && (
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Accessibility Preferences</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Font Size</span>
                  <span className="font-medium capitalize">
                    {profile.accessibilityPreferences.fontSize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Captions</span>
                  <span className="font-medium">
                    {profile.accessibilityPreferences.enableCaptions ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High Contrast</span>
                  <span className="font-medium">
                    {profile.accessibilityPreferences.highContrast ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
