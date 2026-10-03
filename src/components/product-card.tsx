"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Minus, Plus, Star, X } from "lucide-react";
import { useCart } from "@/components/cart-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, setQuantity, lines } = useCart();
  const quantity = lines.find((line) => line.product.id === product.id)?.quantity ?? 0;
  const [detailsOpen, setDetailsOpen] = useState(false);

  return <>
    <article className="product-card" style={{ "--card-index": index } as React.CSSProperties}>
      <button className="product-image-button" onClick={() => setDetailsOpen(true)} aria-label={`View details for ${product.name}`}>
        <div className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 25vw" unoptimized/>{product.badge && <span className="product-badge">{product.badge}</span>}<span className="image-arrow"><ArrowUpRight size={17}/></span></div>
      </button>
      <div className="product-info">
        <div className="product-meta"><span>{product.category}</span><span className="product-rating"><Star size={12} fill="currentColor"/> {product.rating.toFixed(1)}</span></div>
        <button className="product-name" onClick={() => setDetailsOpen(true)}>{product.name}</button>
        <p className="product-description">{product.description}</p>
        <div className="product-buy-row"><strong>{formatPrice(product.price)}</strong>{quantity > 0 ? <QuantityControl product={product} quantity={quantity} setQuantity={setQuantity}/> : <button className="add-button" onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to cart`}><Plus size={15}/><span>Add</span></button>}</div>
      </div>
    </article>
    {detailsOpen && <ProductDetailModal product={product} onClose={() => setDetailsOpen(false)}/>}
  </>;
}

function QuantityControl({ product, quantity, setQuantity }: { product: Product; quantity: number; setQuantity: (id: string, quantity: number) => void }) {
  return <div className="quantity-control card-quantity" aria-label={`${product.name} quantity`}><button aria-label={`Decrease ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={12}/></button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={12}/></button></div>;
}

export function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <button className="modal-close icon-button" onClick={onClose} aria-label="Close product details"><X/></button>
      <div className="modal-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized/></div>
      <div className="modal-copy"><span className="eyebrow">{product.category} · <span className="product-rating"><Star size={12} fill="currentColor"/> {product.rating.toFixed(1)}</span></span><h2 id="product-modal-title">{product.name}</h2><p className="modal-description">{product.description}</p><div className="detail-list"><div><strong>Ingredients</strong><span>{product.ingredients.join(", ")}</span></div><div><strong>Allergens</strong><span>{product.allergens.join(", ")}</span></div></div><div className="modal-buy"><strong>{formatPrice(product.price)}</strong><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={13}/></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus size={13}/></button></div><button className="button button-dark" onClick={() => { addToCart(product.id, quantity); onClose(); }}>Add to bag <Plus size={15}/></button></div></div>
    </section>
  </div>;
}