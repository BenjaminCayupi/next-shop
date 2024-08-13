'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

interface params {
  page: number;
}

export const getPaginatedOrders = async ({ page = 0 }: params) => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Unauthorized',
    };
  }

  try {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    const take = 12;

    const { orders, count } = await Promise.all([
      prisma.order.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: take,
        skip: (page - 1) * take,
        include: {
          OrderAddress: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.order.count(),
    ]).then((results) => ({
      orders: results[0],
      count: results[1],
    }));

    if (!orders) {
      throw new Error('No existen ordenes');
    }

    const totalPages = Math.ceil(count / take);

    return {
      ok: true,
      orders,
      currentPage: page,
      totalPages,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
