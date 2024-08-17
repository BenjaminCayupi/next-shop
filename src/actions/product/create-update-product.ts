'use server';

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
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

  const prismaTx = await prisma.$transaction(async (tx) => {
    let product: Product;
    const formatedTag = rest.tags.split(',').map((t) => t.trim().toLowerCase());

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

  console.log('prismaTx :', prismaTx);

  return {
    ok: true,
  };
};
