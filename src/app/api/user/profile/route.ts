// File: src/app/api/profile/route.ts

import {NextApiRequest, NextApiResponse } from 'next';
import {getSession } from 'next-auth/react';
import {prisma } from '@/lib/prisma';

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { name, image, isDarkMode, emailNotifications } = await req.json();
    const userId = session.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: { name, image },
    });

    // Update user settings in the database
    await prisma.settings.update({
      where: { userId: userId },
      data: { isDarkMode, emailNotifications },
    });

    return new Response(JSON.stringify({ message: 'Profile updated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to update profile' }), { status: 500 });
  }
}
