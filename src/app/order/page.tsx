"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-store";
import { formatPrice } from "@/lib/utils";

type OrderConfirmation = {
  orderNumber: string;
  name: string;
  email: string;
  date: string;
  time: string;
  method: "delivery" | "pickup";
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

export default function OrderPage() {
  const { lines, subtotal, setQuantity, removeFromCart, clearCart, notify } = useCart();
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState("cash");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const deliveryFee = fulfillment === "delivery" && subtotal > 0 && subtotal < 45 ? 5.95 : 0;
  const tax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + deliveryFee + tax;
  const earliestDate = useMemo(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 10);
  }, []);

  function applyCoupon() {
    if (couponInput.trim().toUpperCase() === "SWEET10") {
      setCouponApplied(true);
      setCouponError("");
      notify("Sweet! 10% off has been applied.");
    } else {
      setCouponApplied(false);
      setCouponError("That code doesn’t look right. Try SWEET10.");
    }
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!lines.length) {
      setFormError("Your bag is empty. Add something lovely before checkout.");
      return;
    }
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/.test(phone)) {
      setFormError("Please enter a valid phone number so we can reach you about your order.");
      return;
    }
    const email = String(data.get("email"));
    const name = String(data.get("name"));
    setConfirmation({
      orderNumber: `SC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      name,
      email,
      date: String(data.get("date")),
      time: String(data.get("time")),
      method: fulfillment,
      items: lines.map(({ product, quantity }) => ({ name: product.name, quantity, price: product.price })),
      total,
    });
    setFormError("");
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmation) return <OrderSuccess confirmation={confirmation}/>;

  return <>
    <section className="order-heading"><div><span className="eyebrow">Fresh, just for you</span><h1>Let’s make it <em>official.</em></h1><p>Choose your bakes, pick a time, and we’ll take care of the rest.</p></div><span className="order-step-indicator"><span className="step-current">01</span><span className="step-rule"/><span>02</span><span className="step-label">Your order&nbsp; / &nbsp;Details</span></span></section>
    {lines.length === 0 ? <section className="empty-order"><span className="empty-order-icon"><ShoppingBag size={28}/></span><span className="eyebrow">A fresh start</span><h2>Your bag is <em>empty.</em></h2><p>We’ve got a whole counter full of good things waiting for you.</p><Link href="/menu" className="button button-dark">Browse the menu <ArrowRight size={16}/></Link><Link href="/" className="text-link"><ArrowLeft size={14}/> Back to home</Link></section> : <form className="checkout-layout" onSubmit={submitOrder}>
      <div className="checkout-form-column">
        <section className="checkout-section"><div className="checkout-section-head"><span className="section-index">01</span><div><h2>Let us know where</h2><p>We’ll keep you in the loop as your order comes together.</p></div></div><div className="checkout-fields"><div className="form-row"><div className="form-field"><label htmlFor="checkout-name">Full name <span>*</span></label><input id="checkout-name" name="name" required autoComplete="name" placeholder="Your name"/></div><div className="form-field"><label htmlFor="checkout-email">Email address <span>*</span></label><input id="checkout-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"/></div></div><div className="form-field"><label htmlFor="checkout-phone">Phone number <span>*</span></label><input id="checkout-phone" name="phone" type="tel" required autoComplete="tel" placeholder="(718) 555-0148"/><span className="field-hint">Only used if we need to reach you about this order.</span></div><div className="form-field"><span className="field-label">How would you like it? <span>*</span></span><div className="fulfillment-options"><label className={fulfillment === "delivery" ? "choice-card selected" : "choice-card"}><input type="radio" name="fulfillment" value="delivery" checked={fulfillment === "delivery"} onChange={() => setFulfillment("delivery")}/><span className="choice-dot"/><span><strong>Delivery</strong><small>{subtotal >= 45 ? "On us for orders over $45" : "$5.95 · Free over $45"}</small></span></label><label className={fulfillment === "pickup" ? "choice-card selected" : "choice-card"}><input type="radio" name="fulfillment" value="pickup" checked={fulfillment === "pickup"} onChange={() => setFulfillment("pickup")}/><span className="choice-dot"/><span><strong>Pick up</strong><small>28 Maple Street · Free</small></span></label></div></div>{fulfillment === "delivery" && <><div className="form-field"><label htmlFor="checkout-address">Delivery address <span>*</span></label><input id="checkout-address" name="address" required autoComplete="street-address" placeholder="Street and apartment number"/></div><div className="form-row"><div className="form-field"><label htmlFor="checkout-city">City <span>*</span></label><input id="checkout-city" name="city" required autoComplete="address-level2" defaultValue="Brooklyn"/></div><div className="form-field"><label htmlFor="checkout-postal">Postal code <span>*</span></label><input id="checkout-postal" name="postal" required autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" placeholder="11201" title="Enter a valid ZIP code"/></div></div></>}</div></section>

        <section className="checkout-section"><div className="checkout-section-head"><span className="section-index">02</span><div><h2>Choose your moment</h2><p>A little planning makes the first bite even better.</p></div></div><div className="checkout-fields"><div className="form-row"><div className="form-field"><label htmlFor="checkout-date">{fulfillment === "delivery" ? "Delivery date" : "Pickup date"} <span>*</span></label><input id="checkout-date" type="date" name="date" required min={earliestDate}/></div><div className="form-field"><label htmlFor="checkout-time">Preferred time <span>*</span></label><select id="checkout-time" name="time" required defaultValue=""><option value="" disabled>Choose a time</option><option>8:00 – 10:00 AM</option><option>10:00 AM – 12:00 PM</option><option>12:00 – 2:00 PM</option><option>2:00 – 4:00 PM</option><option>4:00 – 6:00 PM</option><option>6:00 – 8:00 PM</option></select></div></div><div className="form-field"><label htmlFor="checkout-notes">A note for the bakers <small>(optional)</small></label><textarea id="checkout-notes" name="notes" rows={3} placeholder="Allergy note, gate code, or a little something we should know…"/></div></div></section>

        <section className="checkout-section payment-section"><div className="checkout-section-head"><span className="section-index">03</span><div><h2>One last thing</h2><p>Pick how you’d like to settle up. This is a demo checkout; no payment is processed.</p></div></div><div className="payment-options"><label className={payment === "cash" ? "payment-choice selected" : "payment-choice"}><input type="radio" name="payment" value="cash" checked={payment === "cash"} onChange={() => setPayment("cash")}/><span className="choice-dot"/><span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span></label><label className={payment === "card" ? "payment-choice selected" : "payment-choice"}><input type="radio" name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")}/><span className="choice-dot"/><span><strong>Card payment</strong><small>Demo only · no card details needed</small></span></label><label className={payment === "pickup" ? "payment-choice selected" : "payment-choice"}><input type="radio" name="payment" value="pickup" checked={payment === "pickup"} onChange={() => setPayment("pickup")}/><span className="choice-dot"/><span><strong>Pay at pickup</strong><small>At the counter on Maple Street</small></span></label></div></section>
        {formError && <p className="form-error checkout-error" role="alert">{formError}</p>}
      </div>

      <aside className="order-summary"><div className="summary-heading"><div><span className="eyebrow">Your little feast</span><h2>Order summary</h2></div><span className="summary-count">{lines.reduce((count, line) => count + line.quantity, 0)} items</span></div><div className="summary-items">{lines.map(({ product, quantity }) => <article className="summary-item" key={product.id}><div className="summary-item-image"><Image src={product.image} alt={product.name} fill sizes="72px" unoptimized/></div><div className="summary-item-info"><strong>{product.name}</strong><span>{formatPrice(product.price)} each</span><div className="quantity-control"><button type="button" aria-label={`Decrease ${product.name}`} onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={12}/></button><span>{quantity}</span><button type="button" aria-label={`Increase ${product.name}`} onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={12}/></button></div></div><strong className="summary-line-total">{formatPrice(product.price * quantity)}</strong><button type="button" className="summary-remove" aria-label={`Remove ${product.name}`} onClick={() => removeFromCart(product.id)}><Trash2 size={14}/></button></article>)}</div>
        <div className="coupon-form"><label htmlFor="coupon-code">A little code, perhaps?</label><div><input id="coupon-code" value={couponInput} onChange={(event) => { setCouponInput(event.target.value); setCouponError(""); if (couponApplied) setCouponApplied(false); }} placeholder="Enter code" aria-describedby={couponError ? "coupon-error" : undefined}/><button type="button" onClick={applyCoupon} disabled={couponApplied}>{couponApplied ? <><Check size={14}/> Added</> : "Apply"}</button></div>{couponApplied && <span className="coupon-success" role="status">SWEET10 applied · 10% off</span>}{couponError && <span id="coupon-error" className="form-error" role="alert">{couponError}</span>}</div>
        <div className="summary-totals"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>{couponApplied && <div className="discount-row"><span>Sweet Crust treat · 10%</span><strong>−{formatPrice(discount)}</strong></div>}<div><span>Delivery</span><strong>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</strong></div><div><span>Tax</span><strong>{formatPrice(tax)}</strong></div><div className="grand-total"><span>Total</span><strong>{formatPrice(total)}</strong></div></div><button className="button button-dark place-order-button" type="submit">Place my order <ArrowRight size={16}/></button><p className="secure-note"><ShieldCheck size={14}/> No real payment is collected.</p><Link href="/menu" className="back-to-menu"><ArrowLeft size={14}/> Add another bake</Link></aside>
    </form>}
  </>;
}

function OrderSuccess({ confirmation }: { confirmation: OrderConfirmation }) {
  const deliveryText = confirmation.method === "pickup" ? "Ready for pickup" : "On its way";
  return <section className="order-success-page"><div className="order-success-card"><div className="order-success-icon"><Check size={27}/></div><span className="eyebrow">It’s official</span><h1>Oven-fresh joy,<br/><em>coming right up.</em></h1><p className="success-greeting">Thank you, {confirmation.name.split(" ")[0]}. We’ve got your order.</p><div className="order-number-row"><span>Order number</span><strong>{confirmation.orderNumber}</strong></div><div className="success-items"><h2>In the bag</h2>{confirmation.items.map((item) => <div key={item.name}><span>{item.quantity} × {item.name}</span><strong>{formatPrice(item.quantity * item.price)}</strong></div>)}</div><div className="success-total"><span>Total paid at {confirmation.method === "pickup" ? "pickup" : "delivery"}</span><strong>{formatPrice(confirmation.total)}</strong></div><div className="success-eta"><span className="eta-icon">✳</span><div><strong>{deliveryText} · {new Date(`${confirmation.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong><span>{confirmation.time} · Confirmation sent to {confirmation.email}</span></div></div><Link href="/menu" className="button button-dark success-continue">Continue shopping <ArrowRight size={16}/></Link></div><div className="success-side-note"><span>THANK YOU</span><i>✳</i><span>FOR KEEPING OUR<br/>OVEN WARM</span></div></section>;
}