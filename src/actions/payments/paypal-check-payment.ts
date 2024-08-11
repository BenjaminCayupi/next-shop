'use server';

import { PaypalOrderStatusResponse } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: 'No se pudo obtener el token',
    };
  }

  const resp = await verifyPaypalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: 'Error al verificar el pago',
    };
  }

  const { status, purchase_units } = resp;
  /* const {} = purchase_units[0] */ // Todo: invoice id

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Aun no se ha pagado en paypal',
    };
  }

  const { invoice_id: orderId } = purchase_units[0];

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.log('error :', error);
    return {
      ok: false,
      message: 'No se pudo verificar el pago',
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const SECRET_ID = process.env.PAYPAL_SECRET;
  const oauthUrl = process.env.PAYPAL_OAUTH_URL ?? '';

  const base64Secret = Buffer.from(
    `${CLIENT_ID}:${SECRET_ID}`,
    'utf-8'
  ).toString('base64');

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Basic ${base64Secret}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauthUrl, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json());
    return result.access_token;
  } catch (error) {
    console.log('error :', error);
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const orderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  try {
    const resp = await fetch(orderUrl, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json());
    return resp;
  } catch (error) {
    console.log('error :', error);
    return null;
  }
};