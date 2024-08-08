export const revalidate = 60;

import { getPaginatedProductsWithImages } from '@/actions';
import { Title, ProductGrid, Pagination } from '@/components';
import { Gender } from '@prisma/client';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;
  const { page } = searchParams;
  const pageString = page ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;

  const labels: Record<string, string> = {
    men: 'hombre',
    women: 'mujer',
    kid: 'niños',
    unisex: 'todos',
  };

  if (!labels[gender]) {
    notFound();
  }

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: currentPage,
    gender: gender as Gender,
  });

  return (
    <>
      <Title
        title={`Articulos para ${labels[gender]}`}
        subTitle='Todos los productos'
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
