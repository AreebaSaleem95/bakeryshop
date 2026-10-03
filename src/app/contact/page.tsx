"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Camera, Clock3, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    if (phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/.test(phone)) {
      setError("Please enter a phone number we can reach you at.");
      return;
    }
    setError("");
    setSubmitted(true);
    form.reset();
  }

  return <>
    <section className="contact-heading page-masthead"><div className="page-masthead-copy"><span className="eyebrow">There’s always room for one more</span><h1>Come say <em>hello.</em></h1><p>Questions about an order? Planning a little celebration? We’d love to hear from you.</p><div className="masthead-detail"><span>We usually reply within one business day</span></div></div><div className="contact-heading-note"><span className="contact-note-star">✳</span><span>Come as you are.<br/>Leave a little happier.</span><span className="contact-note-sign">— The Sweet Crust team</span></div></section>

    <section className="contact-main-section">
      <div className="contact-form-column"><div className="contact-form-heading"><span className="eyebrow">Send us a note</span><h2>What’s on <em>your mind?</em></h2></div>
        {submitted ? <div className="form-success" role="status"><span className="success-mark">✳</span><div><h3>Your note is on its way.</h3><p>Thanks for reaching out. One of us will be in touch very soon.</p><button className="text-link" onClick={() => setSubmitted(false)}>Send another note <ArrowRight size={14}/></button></div></div> : <form className="contact-form" onSubmit={submitContact}>
          <div className="form-field"><label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" name="name" type="text" autoComplete="name" required placeholder="How should we greet you?"/></div>
          <div className="form-row"><div className="form-field"><label htmlFor="contact-email">Email address <span>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></div><div className="form-field"><label htmlFor="contact-phone">Phone <small>(optional)</small></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="(718) 555-0148"/></div></div>
          <div className="form-field"><label htmlFor="contact-subject">What’s this about? <span>*</span></label><select id="contact-subject" name="subject" required defaultValue=""><option value="" disabled>Choose a topic</option><option>Custom cake or event</option><option>Order question</option><option>Allergens and ingredients</option><option>Something else</option></select></div>
          <div className="form-field"><label htmlFor="contact-message">Your message <span>*</span></label><textarea id="contact-message" name="message" required minLength={10} rows={5} placeholder="Tell us a little more…"/></div>
          {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark contact-submit" type="submit">Send your note <Send size={15}/></button>
        </form>}
      </div>
      <aside className="contact-info-column"><div className="contact-info-top"><span className="eyebrow">Find our little corner</span><div className="contact-address"><MapPin size={18}/><div><strong>28 Maple Street</strong><span>Brooklyn, NY 11201</span></div></div><div className="contact-detail"><Phone size={17}/><a href="tel:+17185550148">(718) 555-0148</a></div><div className="contact-detail"><span className="contact-at">@</span><a href="mailto:hello@sweetcrust.com">hello@sweetcrust.com</a></div><div className="hours-block"><div className="hours-title"><Clock3 size={17}/><strong>Come on in</strong></div><div><span>Monday–Saturday</span><strong>8:00 AM – 8:00 PM</strong></div><div><span>Sunday</span><strong>9:00 AM – 5:00 PM</strong></div></div><a className="contact-social" href="https://instagram.com" aria-label="Visit Sweet Crust on Instagram"><Camera size={18}/> Little moments, @sweetcrustbakery <ArrowRight size={14}/></a></div>
        <a className="map-placeholder" href="https://maps.google.com/?q=28+Maple+Street+Brooklyn+NY" target="_blank" rel="noreferrer" aria-label="Open directions to 28 Maple Street in Google Maps"><span className="map-grid map-grid-one"/><span className="map-grid map-grid-two"/><span className="map-road road-one"/><span className="map-road road-two"/><span className="map-road road-three"/><span className="map-park">MAPLE<br/>GARDEN</span><span className="map-marker"><MapPin size={19} fill="currentColor"/></span><span className="map-label">SWEET CRUST</span><span className="map-directions">Open directions <ArrowRight size={13}/></span></a>
      </aside>
    </section>
    <section className="contact-bottom-band"><span>Have an early pickup?</span><p>We’re happy to have your order ready before opening. Just leave us a note when you check out.</p><Link href="/order">Plan a pickup <ArrowRight size={14}/></Link></section>
  </>;
}