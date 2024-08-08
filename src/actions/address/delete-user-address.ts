'use server';

import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
  try {
    const addressExist = await prisma.userAddress.findFirst({
      where: { userId },
    });

    if (addressExist) {
      await prisma.userAddress.delete({ where: { userId } });
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.log('error :', error);
    return {
      ok: false,
      message: 'No se pudo borrar la direccion',
    };
  }
};
