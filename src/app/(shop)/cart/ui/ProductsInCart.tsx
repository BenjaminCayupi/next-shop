'use client';

import { ProductImage, QuantitySelector } from '@/components';
import { useCartStore } from '@/store';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProduct = useCartStore((state) => state.removeProduct);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando ...</p>;
  }

  if (!productsInCart.length) {
    return redirect('/empty');
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className='flex mb-5'>
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            style={{
              width: '100px',
              height: '100px',
            }}
            alt={product.title}
            className='mr-5 rounded'
          />
          <div>
            <Link
              href={`/product/${product.slug}`}
              className='hover:underline cursor-pointer'
            >
              <p className=''>
                {product.title} - Talla : {product.size}
              </p>
            </Link>
            <p className=''>${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChanged={(value) =>
                updateProductQuantity(product, value)
              }
            />
            <button
              className='underline mt-3'
              onClick={() => removeProduct(product)}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
