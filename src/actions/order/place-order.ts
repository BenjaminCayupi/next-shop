'use server';

import { auth } from '@/auth';
import { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductsToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductsToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: 'No existe sesion de usuario',
    };
  }

  /* Obtener informacion de los productos */
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  /* Calcular los montos */
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  const { subTotal, total, tax } = productIds.reduce(
    (totals, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product doesn't exist`);

      const subTotal = product.price * item.quantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal + subTotal * 0.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      /* 1.- actualizar stock */
      const updatedProductPromises = products.map((product) => {
        const productQuantity = productIds
          .filter((pr) => pr.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0)
          throw new Error(`${product.id} no tiene cantidad definida`);

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductPromises);

      /* Verificar stock disponible */
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock.`);
        }
      });

      /* 2.- crear orden, encabezado, y detalles */
      /*   - Mapeo de productos de la orden (OrderItems) antes de crear la orden */

      const orderItemsData = productIds.map((itemProduct) => {
        const product = products.find((pr) => pr.id === itemProduct.productId);
        if (!product) throw new Error(`Product doesn't exist - order item`);
        return {
          quantity: itemProduct.quantity,
          size: itemProduct.size,
          productId: itemProduct.productId,
          price: product.price,
        };
      });

      /* order */

      const order = await tx.order.create({
        data: {
          userId,
          subTotal,
          tax,
          total,
          itemsInOrder,

          OrderItem: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
      });

      /* 3.- order address */

      const { country, ...restAddress } = address;

      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order,
        updatedProducts: updatedProducts,
        orderAddress,
      };
    });

    return {
      ok: true,
      order: transaction.order,
      transaction,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }

  //
};
