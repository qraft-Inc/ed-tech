import { requireAuth } from '@/lib/auth-helpers';
import Sidebar from '@/components/Sidebar';
import Profile from '@/models/Profile';
import connectDB from '@/lib/db';
import DashboardLayoutWrapper from '@/components/DashboardLayoutWrapper';

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  
  await connectDB();
  const profile = await Profile.findOne({ userId: user.id }).lean();
  const userName = profile ? `${profile.firstName} ${profile.lastName}` : user.email;

  return (
    <DashboardLayoutWrapper sidebar={<Sidebar role="learner" userName={userName} />}>
      {children}
    </DashboardLayoutWrapper>
  );
}
