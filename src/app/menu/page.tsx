"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard, ProductDetailModal } from "@/components/product-card";
import { categories, products, type Product, type ProductCategory } from "@/lib/products";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All bakes">("All bakes");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [missingProduct, setMissingProduct] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("search") ?? "");
    const productId = params.get("product");
    if (productId) {
      const product = products.find((item) => item.id === productId);
      if (product) setSelectedProduct(product);
      else setMissingProduct(true);
    }
  }, []);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "All bakes" || product.category === activeCategory;
    const search = query.trim().toLowerCase();
    const matchesSearch = !search || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  }), [activeCategory, query]);

  return <>
    <section className="page-masthead menu-masthead"><div className="page-masthead-copy"><span className="eyebrow">Good things, baked daily</span><h1>A menu for <em>the moment.</em></h1><p>Something buttery, something sweet, something that makes today feel a little more like a treat.</p><div className="masthead-detail"><span>23 small-batch favorites</span><span>·</span><span>Made fresh each morning</span></div></div><div className="masthead-image"><Image src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85" alt="Fresh artisan loaves from the Sweet Crust bakery" fill sizes="(max-width: 760px) 100vw, 45vw" unoptimized/><span className="image-caption">A little joy, made by hand</span></div></section>

    <section className="menu-content section">
      <div className="menu-toolbar"><div className="category-filters" role="group" aria-label="Filter products by category"><button className={activeCategory === "All bakes" ? "active" : ""} onClick={() => setActiveCategory("All bakes")}>All bakes <span>{products.length}</span></button>{categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="menu-search"><Search size={17}/><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search our bakes…"/><button type="button" className={query ? "search-clear visible" : "search-clear"} aria-label="Clear search" onClick={() => setQuery("")}><X size={14}/></button></label></div>
      <div className="menu-results-row"><span>{query ? <>{filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} for <strong>“{query}”</strong></> : <>{activeCategory === "All bakes" ? "Everything from the oven" : activeCategory} <span className="result-count">({filteredProducts.length})</span></>}</span><span className="menu-made-note"><SlidersHorizontal size={13}/> Baked in small batches</span></div>
      {missingProduct && <div className="inline-notice" role="status">That bake isn’t on today’s menu. Have a look at the rest of our favorites.</div>}
      {filteredProducts.length ? <div className="product-grid menu-product-grid">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index}/>)}</div> : <div className="no-results"><span className="no-results-mark">✳</span><h2>No products found</h2><p>Nothing on the tray matches “{query}”. Try another search or browse all our bakes.</p><button className="button button-dark" onClick={() => { setQuery(""); setActiveCategory("All bakes"); }}>Show all bakes <ArrowRight size={15}/></button></div>}
    </section>
    <section className="menu-note-band"><div><span className="eyebrow">A small heads-up</span><p>Our menu changes with the seasons. Have an allergy or a special occasion? <Link href="/contact">Let us know <ArrowRight size={14}/></Link></p></div><span className="menu-note-flourish">✳</span></section>
    {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
  </>;
}