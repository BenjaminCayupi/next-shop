import { create } from 'zustand';
import type { ProductInCart } from '@/interfaces';
import { persist } from 'zustand/middleware';

interface State {
  cart: ProductInCart[];
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };
  addProductToCart: (product: ProductInCart) => void;
  updateProductQuantity: (product: ProductInCart, quantity: number) => void;
  removeProduct: (product: ProductInCart) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (total, item) => item.price * item.quantity + total,
          0
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },
      addProductToCart: (product: ProductInCart) => {
        const { cart } = get();

        const productExistInCart = cart.some(
          (cartProduct) =>
            cartProduct.id === product.id && cartProduct.size === product.size
        );

        if (!productExistInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        const updatedCartProducts = cart.map((cartProduct) => {
          if (
            cartProduct.id === product.id &&
            cartProduct.size === product.size
          ) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + product.quantity,
            };
          }
          return cartProduct;
        });
        set({ cart: updatedCartProducts });
      },
      updateProductQuantity: (product: ProductInCart, quantity: number) => {
        const { cart } = get();

        const updatedCart = cart.map((productInCart) => {
          if (
            productInCart.id === product.id &&
            productInCart.size === product.size
          ) {
            return { ...productInCart, quantity: quantity };
          }

          return productInCart;
        });

        set({ cart: updatedCart });
      },
      removeProduct: (product: ProductInCart) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (productInCart) =>
            productInCart.id !== product.id ||
            productInCart.size !== product.size
        );

        set({ cart: updatedCart });
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);
