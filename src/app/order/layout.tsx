import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Order fresh breads, pastries, cakes, and coffee for delivery or pickup from Sweet Crust Bakery.",
};

export default function OrderLayout({ children }: LayoutProps<"/order">) { return children; }