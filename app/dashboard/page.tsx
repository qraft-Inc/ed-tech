import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-helpers';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { UserRole } from '@/models';

export default async function DashboardPage() {
  const user = await requireAuth();
  
  // Redirect based on role
  if (user.role === UserRole.SYSTEM_ADMIN) {
    redirect('/admin/dashboard');
  } else if (user.role === UserRole.PARTNER_ADMIN) {
    redirect('/partner/dashboard');
  } else if (user.role === UserRole.FACILITATOR) {
    redirect('/facilitator/dashboard');
  } else {
    redirect('/learner/dashboard');
  }
}
