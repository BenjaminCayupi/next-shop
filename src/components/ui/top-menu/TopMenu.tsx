'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';

import { titleFont } from '@/config/fonts';
import { useCartStore, useUiStore } from '@/store';

export const TopMenu = () => {
  const openSideMenu = useUiStore((state) => state.openSideMenu);
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className='flex px-5 justify-between items-center w-full'>
      {/* Logo */}
      <div>
        <Link href={'/'}>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo | Shop
          </span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className='hidden sm:block'>
        <Link
          href={'/gender/men'}
          className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
        >
          Hombres
        </Link>
        <Link
          href={'/gender/women'}
          className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
        >
          Mujeres
        </Link>
        <Link
          href={'/gender/kid'}
          className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
        >
          Niños
        </Link>
      </div>

      {/* Search, Cart, Menu */}
      <div className='flex items-center'>
        <Link href={'/search'} className='mx-2'>
          <IoSearchOutline className='w-5 h-5' />
        </Link>
        <Link
          href={totalCartItems === 0 && loaded ? '/empty' : '/cart'}
          className='mx-2'
        >
          <div className='relative'>
            {loaded && totalCartItems > 0 && (
              <span className='fade-in absolute text-xs rounded-full px-1 -top-2 -right-2 bg-blue-700 text-white'>
                {totalCartItems}
              </span>
            )}
            <IoCartOutline className='w-5 h-5' />
          </div>
        </Link>

        <button
          onClick={() => openSideMenu()}
          className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
