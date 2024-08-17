export const dynamic = 'force-dynamic';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';

import Link from 'next/link';

interface Props {
  searchParams: { page: string };
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  return (
    <>
      <Title title='Mantenedor productos' />
      <div className='flex justify-end mb-5'>
        <Link href={'/admin/product/new'} className='btn-primary'>
          Nuevo producto
        </Link>
      </div>

      <div className='mb-10'>
        <table className='min-w-full'>
          <thead className='bg-gray-200 border-b'>
            <tr>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Imagen
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Titulo
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Precio
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Genero
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Inventario
              </th>
              <th
                scope='col'
                className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              >
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product.id}
                className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage
                      src={product.ProductImage[0]?.url}
                      width={90}
                      height={90}
                      alt={product.title}
                    />
                  </Link>
                </td>
                <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap '>
                  <Link href={`/product/${product.slug}`}>
                    <span className='underline'>{product.title}</span>
                  </Link>
                </td>
                <td className='text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                  {product.price}
                </td>
                <td className='text-sm text-gray-900 font-light px-6 '>
                  {product.gender}
                </td>
                <td className='text-sm text-gray-900 font-light px-6 '>
                  {product.inStock}
                </td>
                <td className='text-sm text-gray-900 font-light px-6 '>
                  {product.sizes.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination totalPages={totalPages ?? 0} />
      </div>
    </>
  );
}
