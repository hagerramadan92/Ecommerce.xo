"use client";

import { ProductIn } from "@/Types/ProductIn";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
  cart: ProductIn[];
  addToCart: (item: ProductIn) => void;
  removeFromCart: (id: number) => void;
  changeQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ProductIn[]>([]);
const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  },  [loaded]);

  const saveCart = (newCart: ProductIn[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (item: ProductIn) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      const updatedCart = cart.map((c) =>
        c.id === item.id
          ? { ...c, quantity: (c.quantity || 1) + (item.quantity || 1) }
          : c
      );
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    saveCart(cart.filter((c) => c.id !== id));
  };

  const changeQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => saveCart([]);

  const total = cart.reduce((acc, item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
        : item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
