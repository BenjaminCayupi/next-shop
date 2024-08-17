import { Title } from '@/components';
import { ProductForm } from './ui/ProductForm';
import { getCategories, getProductBySlug } from '@/actions';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== 'new') return redirect('/admin/products');

  const title = slug === 'new' ? 'Crear producto' : 'Editar producto';

  return (
    <div>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories} />
    </div>
  );
}
