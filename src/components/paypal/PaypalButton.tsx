'use client';

import { paypalCheckPayment, setTransactionId } from '@/actions';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from '@paypal/paypal-js';

interface Props {
  orderId: string;
  amount: number;
}

const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = (Math.round(amount * 100) / 100).toString(); //123.23

  if (isPending) {
    return (
      <div className='animate-pulse mb-11'>
        <div className='h-[45px] bg-gray-300 rounded' />
        <div className='h-[45px] bg-gray-300 rounded mt-3' />
      </div>
    );
  }

  const createOrder = async (
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
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log('OnApprove');
    const details = await actions.order?.capture();
    if (!details || !details.id) return;

    await paypalCheckPayment(details.id);
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};

export default PaypalButton;
