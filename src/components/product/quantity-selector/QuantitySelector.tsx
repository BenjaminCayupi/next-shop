'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
  quantity: number;
  onQuantityChanged: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
  const onValueChanged = (value: number) => {
    const newValue = quantity + value;

    if (newValue < 1 || newValue > 10) return;

    onQuantityChanged(newValue);
  };
  return (
    <div className='flex'>
      <button onClick={() => onValueChanged(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <div className='w-20 mx-3 rounded bg-gray-200 text-center flex items-center justify-center'>
        <span>{quantity}</span>
      </div>

      <button onClick={() => onValueChanged(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
