import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { findProduct } from "@/lib/products";

const featuredIds = ["chocolate-croissant", "strawberry-cheesecake", "sourdough-bread", "chocolate-fudge-cake", "cinnamon-roll", "blueberry-muffin"];

export default function Home() {
  const featured = featuredIds.map((id) => findProduct(id)).filter((product) => product !== undefined);
  return (
  <>
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow hero-eyebrow"><span className="eyebrow-mark">✳</span> A neighborhood bakery in Brooklyn</span>
        <h1>Freshly Baked.<br/><em>Made With Love.</em></h1>
        <p>Slow mornings start here. Find crusty loaves, buttery pastries, and little celebrations baked fresh every day.</p>
        <div className="hero-actions"><Link className="button button-dark" href="/order">Order something lovely <ArrowRight size={16}/></Link><Link className="button button-outline" href="/menu">Explore the menu <ArrowUpRight size={15}/></Link></div>
        <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span></div><div><strong>Made fresh, every morning</strong><small>Loved by your neighbors since 2014</small></div><div className="hero-proof-rating"><Star size={13} fill="currentColor"/> 4.9</div></div>
        <a className="scroll-cue" href="#favorites"><span>Take a look around</span><ArrowDown size={14}/></a>
      </div>
      <div className="hero-visual"><Image src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=90" alt="Fresh golden artisan bread just out of the bakery oven" fill priority sizes="(max-width: 760px) 100vw, 55vw" unoptimized/><div className="hero-image-shade"/><div className="hero-stamp"><span>BAKED</span><b>WITH</b><span>LOVE</span><i>✳</i></div><div className="hero-caption"><span>THE EARLY BATCH</span><span>6:14 AM · MAPLE STREET</span></div><div className="hero-note"><span className="note-icon">✳</span><span>Good things<br/>take time.</span></div></div>
    </section>

    <section className="ticker" aria-label="Our promise"><div className="ticker-track"><span>REAL BUTTER</span><i>✳</i><span>LONG FERMENTS</span><i>✳</i><span>LOCAL INGREDIENTS</span><i>✳</i><span>BAKED WITH HEART</span><i>✳</i><span>REAL BUTTER</span><i>✳</i><span>LONG FERMENTS</span><i>✳</i><span>LOCAL INGREDIENTS</span><i>✳</i><span>BAKED WITH HEART</span><i>✳</i></div></section>

    <section className="section favorites-section" id="favorites">
      <div className="section-heading-row"><div><span className="eyebrow">A few neighborhood favorites</span><h2>Fresh from <em>our oven.</em></h2></div><Link className="text-link" href="/menu">See everything <ArrowUpRight size={15}/></Link></div>
      <div className="product-grid home-product-grid">{featured.map((product, index) => <ProductCard key={product.id} product={product} index={index}/>)}</div>
    </section>

    <section className="home-story-band">
      <div className="story-band-image"><Image src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1100&q=85" alt="Flaky pastries cooling on a bakery tray" fill sizes="(max-width: 760px) 100vw, 48vw" unoptimized/><span className="image-caption">Made by hand. Never rushed.</span></div>
      <div className="story-band-copy"><span className="eyebrow">Good food. Good neighbors.</span><h2>A little more <em>human</em> in every bite.</h2><p>We believe the best things are made slowly and shared generously. Our dough rests overnight, our fruit comes from nearby farms, and every batch starts before the sun comes up.</p><Link className="text-link" href="/about">The story behind the crust <ArrowRight size={15}/></Link><div className="story-stats"><div><strong>36<span>h</span></strong><small>Slow-fermented</small></div><div><strong>12</strong><small>Local growers</small></div><div><strong>2014</strong><small>Our first loaf</small></div></div></div>
    </section>

    <section className="section why-section"><div className="why-intro"><span className="eyebrow">The Sweet Crust difference</span><h2>Little things,<br/><em>done beautifully.</em></h2><p>Nothing complicated. Just thoughtful ingredients, old-fashioned patience, and a team who cares.</p></div><div className="why-grid"><article><span className="why-number">01</span><div className="why-symbol">✳</div><h3>Started before sunrise</h3><p>Every pastry, loaf, and cake is made by hand in our own kitchen each morning.</p></article><article><span className="why-number">02</span><div className="why-symbol">◌</div><h3>Ingredients with a story</h3><p>Local eggs, real cultured butter, and fruit picked close to home. You can taste it.</p></article><article><span className="why-number">03</span><div className="why-symbol">♡</div><h3>Always room at the table</h3><p>Big birthdays, small Tuesdays, and everything in between. There’s a bake for that.</p></article></div></section>

    <section className="testimonial-band"><span className="eyebrow">Notes from the neighborhood</span><div className="testimonial-quote"><span className="quote-mark">“</span><blockquote>That first bite of the sourdough is my favorite part of every Saturday.</blockquote></div><div className="testimonial-byline"><div className="testimonial-avatar">JL</div><div><strong>Jamie L.</strong><span>Regular since 2017</span></div><div className="testimonial-stars" aria-label="5 out of 5 stars"><Star/><Star/><Star/><Star/><Star/></div></div><div className="testimonial-pagination"><span className="active"/><span/><span/></div></section>

    <section className="visit-banner"><Image src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1800&q=80" alt="Warm light inside a welcoming neighborhood cafe" fill sizes="100vw" unoptimized/><div className="visit-overlay"/><div className="visit-banner-copy"><span className="eyebrow">Your table is waiting</span><h2>Come in for<br/><em>the good stuff.</em></h2><p>28 Maple Street, Brooklyn · Doors open at 8</p><Link className="button button-light" href="/contact">Find your way here <ArrowUpRight size={16}/></Link></div><span className="visit-side-note">COME AS YOU ARE · LEAVE A LITTLE HAPPIER</span></section>
  </>
  );
}
