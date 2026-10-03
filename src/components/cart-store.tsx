"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { findProduct, type Product } from "@/lib/products";

export type CartEntry = { productId: string; quantity: number };
export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  toast: string;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  notify: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sweet-crust-cart");
      if (saved) {
        const parsed = JSON.parse(saved) as CartEntry[];
        if (Array.isArray(parsed)) {
          setEntries(parsed.filter((entry) => findProduct(entry.productId) && entry.quantity > 0));
        }
      }
    } catch {
      localStorage.removeItem("sweet-crust-cart");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("sweet-crust-cart", JSON.stringify(entries));
  }, [entries, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const lines = useMemo(
    () => entries.flatMap((entry) => {
      const product = findProduct(entry.productId);
      return product ? [{ product, quantity: entry.quantity }] : [];
    }),
    [entries],
  );
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);

  const value: CartContextValue = {
    lines,
    itemCount,
    subtotal,
    toast,
    addToCart: (productId, quantity = 1) => {
      if (!findProduct(productId)) return;
      setEntries((current) => {
        const existing = current.find((entry) => entry.productId === productId);
        return existing
          ? current.map((entry) => entry.productId === productId
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry)
          : [...current, { productId, quantity }];
      });
      setToast(`${findProduct(productId)?.name} added to your bag`);
    },
    setQuantity: (productId, quantity) => {
      setEntries((current) => quantity < 1
        ? current.filter((entry) => entry.productId !== productId)
        : current.map((entry) => entry.productId === productId ? { ...entry, quantity } : entry));
    },
    removeFromCart: (productId) => setEntries((current) => current.filter((entry) => entry.productId !== productId)),
    clearCart: () => setEntries([]),
    notify: setToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}