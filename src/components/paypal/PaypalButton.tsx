'use client';

import { setTransactionId } from '@/actions';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CreateOrderData, CreateOrderActions } from '@paypal/paypal-js';

interface Props {
  orderId: string;
  amount: number;
}

const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = amount.toFixed(2).toString();

  if (isPending) {
    return (
      <div className='animate-pulse mb-11'>
        <div className='h-[45px] bg-gray-300 rounded' />
        <div className='h-[45px] bg-gray-300 rounded mt-3' />
      </div>
    );
  }

  /*   const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          //invoice_id: orderId,
          amount: {
            value: roundedAmount,
            currency_code: 'USD',
          },
        },
      ],
    });

    const { ok } = await setTransactionId(orderId, transactionId);
    if (!ok) {
      throw new Error('No se pudo actualizar la orden');
    }

    console.log('transactionId :', transactionId);

    return transactionId;
  }; */

  const createOrderRest = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
    });

    const order = await res.json();
    return order.id;
  };

  return <PayPalButtons createOrder={createOrderRest} />;
};

export default PaypalButton;
