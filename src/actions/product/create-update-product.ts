'use server';

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val)),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(',')),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    const errors = productParsed.error.errors.map((e) => e.message);

    return {
      ok: false,
      message: errors.join(', '),
    };
  }

  const productValidated = productParsed.data;
  productValidated.slug = productValidated.slug
    .toLowerCase()
    .replace(/ /g, '-')
    .trim();

  const { id, ...rest } = productValidated;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const formatedTag = rest.tags
        .split(',')
        .map((t) => t.trim().toLowerCase());

      if (id) {
        //actualizar
        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: formatedTag,
            },
          },
        });
        console.log({ updatedProduct: product });
      } else {
        //crear
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            tags: {
              set: formatedTag,
            },
          },
        });
      }

      return { product };
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${prismaTx.product.slug}`);
    revalidatePath(`/product/${prismaTx.product.slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'Hubo un error al crear o actualizar el producto',
    };
  }
};
