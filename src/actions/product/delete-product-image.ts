'use server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  console.log({ imageId, imageUrl });

  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      message: 'Solo se eliminan imágenes subidas a cloudinary',
    };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    const res = await cloudinary.uploader.destroy(imageName);
    if (res.result == 'ok') {
      const deletedDbImage = await prisma.productImage.delete({
        where: { id: imageId },
        select: {
          product: {
            select: {
              slug: true,
            },
          },
        },
      });

      revalidatePath('/admin/products');
      revalidatePath(`/admin/product/${deletedDbImage.product.slug}`);
      revalidatePath(`/product/${deletedDbImage.product.slug}`);

      return {
        ok: true,
      };
    } else {
      throw new Error('No se pudo eliminar la imagen del servidor');
    }
  } catch (error) {
    console.log('error :', error);
    return {
      ok: false,
      message: 'Ocurrió un error al eliminar la imagen',
    };
  }
};
