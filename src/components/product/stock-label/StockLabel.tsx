'use client';

import { getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts';
import { useEffect, useState } from 'react';

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStock(slug);
  }, [slug]);

  const getStock = async (slug: string) => {
    const stock = await getStockBySlug(slug);
    setStock(stock);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <p className={`animate-pulse bg-gray-300 rounded-md w-20 h-6`}></p>
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-md`}>
          Stock: {stock ? stock : 'agotado'}
        </h1>
      )}
    </>
  );
};
