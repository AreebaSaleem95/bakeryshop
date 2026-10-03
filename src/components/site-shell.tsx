"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CartProvider, useCart } from "@/components/cart-store";
import { CartDrawer, SiteFooter, SiteHeader } from "@/components/site-chrome";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  return <CartProvider>
    <SiteHeader onCartOpen={() => setCartOpen(true)}/>
    <main>{children}</main>
    <SiteFooter/>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}/>
    <CartToast/>
  </CartProvider>;
}

function CartToast() {
  const { toast } = useCart();
  return toast ? <div className="toast" role="status" aria-live="polite"><Check size={16}/>{toast}</div> : null;
}