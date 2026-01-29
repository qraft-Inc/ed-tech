import { requireAuth } from '@/lib/auth-helpers';
import { Settings as SettingsIcon, Globe, Bell } from 'lucide-react';

export default async function PartnerSettingsPage() {
  const user = await requireAuth();

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your organization settings</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-primary-600" />
            <h3 className="font-bold text-lg">Organization Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Organization Name</label>
              <input type="text" className="input" placeholder="Your organization name" />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input type="email" className="input" placeholder="contact@organization.com" />
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" className="input" placeholder="City, Country" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-primary-600" />
            <h3 className="font-bold text-lg">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about your programs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
