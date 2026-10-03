import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Meet the people, ingredients, and patient process behind Sweet Crust Bakery in Brooklyn.",
};

export default function AboutLayout({ children }: LayoutProps<"/about">) { return children; }