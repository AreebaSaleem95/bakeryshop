import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sweet Crust Bakery | Freshly Baked With Love",
    template: "%s | Sweet Crust Bakery",
  },
  description: "Small-batch breads, pastries, cakes, and coffee, baked fresh every morning in Brooklyn.",
  openGraph: {
    title: "Sweet Crust Bakery | Freshly Baked With Love",
    description: "Small-batch breads, pastries, cakes, and coffee, baked fresh every morning in Brooklyn.",
    type: "website",
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
