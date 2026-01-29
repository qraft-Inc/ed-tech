import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/signin');
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  return await requireRole([UserRole.SYSTEM_ADMIN]);
}

export async function requirePartnerAdmin() {
  return await requireRole([UserRole.PARTNER_ADMIN, UserRole.SYSTEM_ADMIN]);
}

export async function requireFacilitator() {
  return await requireRole([
    UserRole.FACILITATOR,
    UserRole.PARTNER_ADMIN,
    UserRole.SYSTEM_ADMIN,
  ]);
}
