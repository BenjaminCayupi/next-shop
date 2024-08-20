import Image from 'next/image';
import { MouseEventHandler } from 'react';

interface Props {
  src?: string;
  width: number;
  height: number;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  onMouseEnter?: MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: MouseEventHandler<HTMLImageElement>;
}

export const ProductImage = ({
  src,
  width,
  height,
  alt,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  const newSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';
  return (
    <Image
      src={newSrc}
      width={width}
      height={height}
      alt={alt}
      className={className ? className : 'rounded object-cover'}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};
