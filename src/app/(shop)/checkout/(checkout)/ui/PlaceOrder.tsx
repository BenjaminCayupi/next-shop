'use client';
import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const PlaceOrder = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { subTotal, tax, total, itemsInCart } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando ...</p>;
  }

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsInCart = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
    }));

    const res = await placeOrder(productsInCart, address);
    if (!res.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(res.message);
      return;
    }

    clearCart();
    router.replace('/orders/' + res.order?.id);
  };

  return (
    <div className='bg-white rounded-xl shadow-xl p-7 h-fit'>
      <h2 className='text-2xl mb-2'>Dirección de entrega</h2>
      <div className='mb-10'>
        <p className='text-xl'>
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>
      {/* Divider */}
      <div className='w-full h-0.5 rounded bg-gray-200 mb-10' />

      <h2 className='text-2xl mb-2'>Resumen de orden</h2>
      <div className='grid grid-cols-2'>
        <span>No. Productos</span>
        <span className='text-right'>
          {itemsInCart === 1
            ? `${itemsInCart} artículo`
            : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className='text-right'>{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className='text-right'>{currencyFormat(tax)}</span>

        <span className='mt-5 text-2xl'>Total</span>
        <span className='mt-5 text-2xl text-right'>
          {currencyFormat(total)}
        </span>
      </div>

      <div className='mt-5 mb-2 w-full'>
        {/* Disclaimer */}
        <p className='mb-5'>
          <span className='text-xs'>
            {`Al hacer click en "Colocar orden", aceptas nuestros`}{' '}
            <a href='#' className='underline'>
              Terminos y condiciones
            </a>{' '}
            y{' '}
            <a href='#' className='underline'>
              politica de privacidad
            </a>
          </span>
        </p>

        <p className='text-sm text-red-500 py-4'>{errorMessage}</p>
        <button
          // href="/orders/123"
          onClick={onPlaceOrder}
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder,
          })}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
