'use server';

import prisma from '@/lib/prisma';

export const getUserAddress = async (userId: string) => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });
    if (!userAddress) return undefined;
    const { countryId: country, address2, ...rest } = userAddress;
    return {
      country,
      address2: address2 ? address2 : '',
      ...rest,
    };
  } catch (error) {
    console.log('error :', error);
    return undefined;
  }
};
