import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';
import { generateUploadSignature } from '@/lib/cloudinary';
import { UserRole } from '@/models';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only facilitators and admins can upload media
    if (
      ![
        UserRole.FACILITATOR,
        UserRole.PARTNER_ADMIN,
        UserRole.SYSTEM_ADMIN,
      ].includes(user.role)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { folder, resourceType } = body;

    const signature = generateUploadSignature(
      folder || 'qraft-academy',
      resourceType || 'auto'
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('Upload signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
