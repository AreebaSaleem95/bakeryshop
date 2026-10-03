"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Camera, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart-store";
import { formatPrice } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our story" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Visit us" },
];

export function SiteHeader({ onCartOpen }: { onCartOpen: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/menu${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <>
      <div className="announcement"><span>Fresh from our ovens, every single morning</span><span className="announcement-dot">✳</span><span>Free local delivery on orders over $45</span></div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Sweet Crust Bakery home">
          <span className="brand-mark" aria-hidden="true">SC</span>
          <span className="brand-copy"><strong>Sweet Crust</strong><small>BAKERY · EST. 2014</small></span>
        </Link>
        <nav className={`primary-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{link.label}</Link>)}
          <div className="mobile-nav-note">Baked with care, just around the corner.</div>
        </nav>
        <div className="header-actions">
          {searchOpen && <form className="header-search" onSubmit={submitSearch}><label className="sr-only" htmlFor="site-search">Search the menu</label><input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find something lovely…"/><button type="submit" aria-label="Submit search"><ArrowRight size={17}/></button></form>}
          <button className={`icon-button search-trigger ${searchOpen ? "selected" : ""}`} aria-label={searchOpen ? "Close search" : "Search menu"} onClick={() => setSearchOpen((open) => !open)}>{searchOpen ? <X size={19}/> : <Search size={19}/>}</button>
          <button className="icon-button cart-trigger" onClick={onCartOpen} aria-label={`Open shopping bag, ${itemCount} items`}><ShoppingBag size={20}/><span>Bag</span><b>{itemCount}</b></button>
          <button className="icon-button mobile-menu-trigger" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>
    </>
  );
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, setQuantity, removeFromCart } = useCart();
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return <div className={`drawer-backdrop ${open ? "visible" : ""}`} aria-hidden={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className={`cart-drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Your shopping bag">
      <div className="drawer-head"><div><p className="eyebrow">A little something</p><h2>Your bag <span>({lines.reduce((count, line) => count + line.quantity, 0)})</span></h2></div><button className="icon-button" aria-label="Close shopping bag" onClick={onClose}><X/></button></div>
      {lines.length === 0 ? <div className="empty-cart"><span className="empty-cart-icon"><ShoppingBag size={26}/></span><h3>Your bag is waiting</h3><p>Find a fresh favorite from our oven.</p><Link className="button button-dark" href="/menu" onClick={onClose}>Explore the menu <ArrowRight size={15}/></Link></div> : <>
        <div className="drawer-items">{lines.map(({ product, quantity }) => <div className="drawer-item" key={product.id}>
          <div className="drawer-item-image"><Image src={product.image} alt={product.name} fill sizes="80px" unoptimized/></div>
          <div className="drawer-item-main"><Link href={`/menu?product=${product.id}`} onClick={onClose}>{product.name}</Link><span>{formatPrice(product.price)}</span><div className="quantity-control"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity + 1)}>+</button></div></div>
          <button className="text-icon remove-item" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name}`}><X size={15}/></button>
        </div>)}</div>
        <div className="drawer-bottom"><div className="drawer-subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Delivery and taxes calculated at checkout.</p><Link className="button button-dark drawer-checkout" href="/order" onClick={onClose}>Continue to checkout <ArrowRight size={16}/></Link><button className="text-link continue-shopping" onClick={onClose}>Keep browsing</button></div>
      </>}
    </aside>
  </div>;
}

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  function subscribe(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!email.trim()) return; setSubscribed(true); setEmail(""); }

  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand-column"><Link href="/" className="brand footer-brand"><span className="brand-mark" aria-hidden="true">SC</span><span className="brand-copy"><strong>Sweet Crust</strong><small>BAKERY · EST. 2014</small></span></Link><p>Small-batch bakes, made slowly and shared generously. Find a little joy in every bite.</p><div className="social-links"><a href="https://instagram.com" aria-label="Instagram"><Camera size={17}/></a><a href="https://facebook.com" aria-label="Facebook" className="social-letter">f</a><a href="https://pinterest.com" aria-label="Pinterest" className="social-letter">p</a></div></div>
      <div className="footer-column"><h3>Explore</h3><Link href="/menu">Our menu</Link><Link href="/about">Our story</Link><Link href="/order">Order online</Link><Link href="/contact">Find us</Link></div>
      <div className="footer-column"><h3>Come by</h3><p>28 Maple Street<br/>Brooklyn, NY 11201</p><a href="tel:+17185550148">(718) 555-0148</a><a href="mailto:hello@sweetcrust.com">hello@sweetcrust.com</a></div>
      <div className="footer-newsletter"><p className="eyebrow">A note from the oven</p><h3>Good things, fresh weekly.</h3><p>Seasonal specials, early-bird treats, and a little sweetness in your inbox.</p><form onSubmit={subscribe} className="newsletter-form"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)}/><button aria-label="Subscribe to newsletter"><ArrowRight size={18}/></button></form><span className="newsletter-feedback" role="status">{subscribed ? "You're on the list. See you soon!" : ""}</span></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Sweet Crust Bakery. Made with care.</span><span>Monday–Saturday · 8am–8pm &nbsp; / &nbsp; Sunday · 9am–5pm</span><Link href="/contact">Questions? We’re here <ArrowRight size={13}/></Link></div>
  </footer>;
}