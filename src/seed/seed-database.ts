import { initialData } from './seed';
import prisma from '../lib/prisma';
import { Product } from '@prisma/client';
import { countries } from './seed-country';

async function main() {
  /* await Promise.all([ */
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  /*  ]); */

  const { categories, products, users } = initialData;

  //Countrys

  const countriesData = await prisma.country.createManyAndReturn({
    data: countries,
  });

  //Users

  await prisma.user.createMany({ data: users });

  //Categorias

  const categoriesData = categories.map((name) => ({ name }));

  const categoriesDb = await prisma.category.createManyAndReturn({
    data: categoriesData,
  });

  const categoriesMap: { [key: string]: string } = {};

  categoriesDb.forEach((category) => {
    categoriesMap[category.name.toLowerCase()] = category.id;
  });

  console.log('categoriesDb :', categoriesDb);
  console.log('categoriesMap :', categoriesMap);
  console.log('countriesData :', countriesData);

  //Productos

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    const imagesMap = images.map((url) => ({ url, productId: dbProduct.id }));

    const dbImages = await prisma.productImage.createManyAndReturn({
      data: imagesMap,
    });
  });
}

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();
