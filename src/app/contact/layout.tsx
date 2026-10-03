import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sweet Crust Bakery, plan your visit, or ask about a custom bake.",
};

export default function ContactLayout({ children }: LayoutProps<"/contact">) { return children; }