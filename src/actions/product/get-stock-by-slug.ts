'use server';

import prisma from '@/lib/prisma';

const sleep = async () => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
};

export const getStockBySlug = async (slug: string) => {
  try {
    await sleep();
    const stock = await prisma.product.findUnique({
      where: { slug },
      select: {
        inStock: true,
      },
    });

    return stock?.inStock ?? 0;
  } catch (error) {
    return 0;
  }
};
