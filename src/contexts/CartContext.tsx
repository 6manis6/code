"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) {
      return false;
    }

    const maxStock = Math.max(product.stock ?? 0, 0);
    let canAdd = true;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id,
      );

      if (existingItem) {
        const nextQuantity = existingItem.quantity + quantity;
        if (nextQuantity > maxStock) {
          canAdd = false;
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, product, quantity: nextQuantity }
            : item,
        );
      }

      if (quantity > maxStock) {
        canAdd = false;
        return prevCart;
      }

      return [...prevCart, { product, quantity }];
    });

    return canAdd;
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product._id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    let canUpdate = true;

    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === productId,
      );
      if (!existingItem) {
        return prevCart;
      }

      const maxStock = Math.max(existingItem.product.stock ?? 0, 0);
      if (quantity > maxStock) {
        canUpdate = false;
        return prevCart;
      }

      return prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      );
    });

    return canUpdate;
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
