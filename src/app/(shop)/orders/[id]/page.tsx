import { getOrderById } from '@/actions';
import { Title } from '@/components';
import PaypalButton from '@/components/paypal/PaypalButton';
import { initialData } from '@/seed/seed';
import { currencyFormat } from '@/utils';
import clsx from 'clsx';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect('/');
  }

  return (
    <div className='flex justify-center items-center mb-72 px-10 sm:px-0'>
      <div className='flex flex-col w-[1000px]'>
        <Title title={`Orden #${id}`} />

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {/* Carrito */}
          <div className='flex flex-col mt-5'>
            <div
              className={clsx(
                'flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5',
                {
                  'bg-red-500': !order?.isPaid,
                  'bg-green-700': order?.isPaid,
                }
              )}
            >
              <IoCardOutline size={30} />

              {order!.isPaid ? (
                <span className='mx-2'>Pagada</span>
              ) : (
                <span className='mx-2'>Pendiente de pago</span>
              )}
            </div>
            {/* Items */}
            {order?.OrderItem.map((item) => (
              <div key={item.product!.title} className='flex mb-5'>
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className='mr-5 rounded'
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>
                    {item.price} x {item.quantity}
                  </p>
                  <p className='font-bold'>
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout */}
          <div className='bg-white rounded-xl shadow-xl p-7 h-fit'>
            <h2 className='text-2xl mb-2'>Dirección de entrega</h2>
            <div className='mb-10'>
              <p className='text-xl'>
                {order!.OrderAddress!.firstName} {order!.OrderAddress!.lastName}
              </p>
              <p>{order!.OrderAddress!.address}</p>
              <p>{order!.OrderAddress!.address2}</p>
              <p>{order!.OrderAddress!.postalCode}</p>
              <p>
                {order!.OrderAddress!.city}, {order!.OrderAddress!.countryId}
              </p>
              <p>{order!.OrderAddress!.phone}</p>
            </div>
            {/* Divider */}
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

            <h2 className='text-2xl mb-2'>Resumen de orden</h2>
            <div className='grid grid-cols-2'>
              <span>No. Productos</span>
              <span className='text-right'>
                {order!.itemsInOrder} articulos
              </span>

              <span>Subtotal</span>
              <span className='text-right'>
                {currencyFormat(order!.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className='text-right'>{currencyFormat(order!.tax)}</span>

              <span className='mt-5 text-2xl'>Total</span>
              <span className='mt-5 text-2xl text-right'>
                {currencyFormat(order!.total)}
              </span>
            </div>

            <div className='mt-5 mb-2 w-full'>
              {/* <div
                className={clsx(
                  'flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5',
                  {
                    'bg-red-500': true,
                    'bg-green-700': true,
                  }
                )}
              >
                <IoCardOutline size={30} />
                {order!.isPaid ? (
                  <span className='mx-2'>Pagada</span>
                ) : (
                  <span className='mx-2'>Pendiente de pago</span>
                )}
              </div> */}
              <PaypalButton orderId={order!.id} amount={order!.total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
