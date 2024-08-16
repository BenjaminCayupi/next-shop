'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return categories;
  } catch (error: any) {
    console.log('error :', error);
    return [];
  }
};
