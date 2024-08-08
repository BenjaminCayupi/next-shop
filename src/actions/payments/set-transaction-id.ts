'use server';

import prisma from '@/lib/prisma';

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  if (!transactionId || !orderId)
    return {
      ok: false,
      message: 'Error en la generacion del pago',
    };

  try {
    const dbTransactionId = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId },
    });

    if (!dbTransactionId) throw new Error('No se encontro la orden');

    return {
      ok: true,
      transactionId,
    };
  } catch (error: any) {
    console.log('error :', error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
