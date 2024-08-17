'use server';

import prisma from '@/lib/prisma';
import { Gender } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  /* Page validation */

  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    /* 1 Obtener los productos y cantidad total de paginas (llamados a bd) */
    const { products, totalCount } = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: take,
        skip: (page - 1) * take,
        where: { gender },
        include: {
          ProductImage: {
            take: 2,
            select: {
              url: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: { gender },
      }),
    ]).then((results) => ({
      products: results[0],
      totalCount: results[1],
    }));

    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error('no se pudo cargar los productos');
  }
};
