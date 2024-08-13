'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

interface params {
  page: number;
}

export const getPaginatedUsers = async ({ page }: params) => {
  const session = auth();
  if (!session)
    return {
      ok: false,
      message: 'unauthorized',
    };

  try {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    const take = 10;

    const { users, count } = await Promise.all([
      prisma.user.findMany({
        take,
        skip: (page - 1) * take,
      }),
      prisma.user.count(),
    ]).then((results) => ({
      users: results[0],
      count: results[1],
    }));

    const totalPages = Math.ceil(count / take);

    return {
      ok: true,
      users,
      totalPages,
      currentPage: page,
    };
  } catch (error: any) {
    console.log('error :', error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
