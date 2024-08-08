'use client';

import { SizeSelector, QuantitySelector } from '@/components';
import { Product, ProductInCart, Size } from '@/interfaces';
import { useCartStore } from '@/store';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const productInCart: ProductInCart = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };

    addProductToCart(productInCart);
    setSize(undefined);
    setQuantity(1);
    setPosted(false);
  };

  return (
    <>
      {posted && !size && (
        <span className='mt-2 text-red-500 fade-in'>
          Debe seleccionar una talla*
        </span>
      )}

      {/* Selector de tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={(size) => setSize(size)}
      />

      {/* Selector de cantidad */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Button cart */}
      <button onClick={addToCart} className='btn-primary my-5'>
        Agregar al carrito
      </button>
    </>
  );
};
