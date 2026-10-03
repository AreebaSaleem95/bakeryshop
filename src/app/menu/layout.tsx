import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakery Menu",
  description: "Browse artisan cakes, pastries, bread, cookies, cupcakes, and drinks baked fresh daily at Sweet Crust Bakery.",
};

export default function MenuLayout({ children }: LayoutProps<"/menu">) { return children; }