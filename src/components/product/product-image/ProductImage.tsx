import Image from 'next/image';

interface Props {
  src?: string;
  width: number;
  height: number;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
}

export const ProductImage = ({ src, width, height, alt, className }: Props) => {
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
    />
  );
};
