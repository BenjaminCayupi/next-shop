'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      message: 'El usuario debe estar autenticado',
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: { url: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error('Order doesnt exist');

    if (order.userId !== session.user.id)
      throw new Error('No esta autorizado para ver esta orden');

    console.log('order :', order);

    return {
      ok: true,
      order,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
