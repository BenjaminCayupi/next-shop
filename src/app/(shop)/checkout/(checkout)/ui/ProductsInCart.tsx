"use client";

import { useCartStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Cargando ...</p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={product.image}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <span>
              <p className="font-normal">
                {product.title} - Talla : {product.size}
              </p>
            </span>
            <p className="font-normal">Cantidad: {product.quantity}</p>
            <p className="font-bold">${product.price * product.quantity}</p>
          </div>
        </div>
      ))}
    </>
  );
};
