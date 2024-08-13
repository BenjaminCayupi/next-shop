'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const changeUserRole = async (userId: string, role: string) => {
  const session = await auth();
  if (!session) {
    return {
      ok: false,
      message: 'unauthorized',
    };
  }

  try {
    const newRole = role === 'admin' ? 'admin' : 'user';

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath('/admin/users');

    return {
      ok: true,
    };
  } catch (error: any) {
    console.log('error :', error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
