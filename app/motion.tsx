"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  PawPrint,
} from "lucide-react";
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}
const slides = [
  {
    id: 111,
    image: "/images/holiday-dogs.jpg",
    tag: "THE CHRISTMAS EDIT",
    title: "For the goodest\non your list.",
    text: "Gift a little adventure. Five travel favourites, thoughtfully paired for the Holiday Road Trip Bundle.",
    price: 199,
    percent: 15,
    href: "/products/holiday-road-trip-bundle/",
    cta: "Unwrap the holiday bundle",
  },
  {
    id: 112,
    image: "/images/christmas.jpg",
    tag: "MAKE ROOM FOR HOLIDAY MEMORIES",
    title: "Their favourite gift?\nGoing with you.",
    text: "A cot, travel bed, blanket and feeding essentials. Meet the Christmas Adventure Bundle.",
    price: 279,
    percent: 16,
    href: "/products/christmas-adventure-bundle/",
    cta: "Discover the adventure bundle",
  },
  {
    id: 113,
    image: "/images/beach-poster.jpg",
    tag: "THE HOLIDAY ESCAPE",
    title: "Sandy paws.\nHappy holidays.",
    text: "Boot protection and clean-up essentials for the ride home. Pack the Coastal Clean-Up Bundle.",
    price: 159,
    percent: 15,
    href: "/products/coastal-clean-up-bundle/",
    cta: "Pack for the coast",
  },
];
export function HolidayCarousel({
  money,
  currency,
  saving,
}: {
  money: (n: number) => string;
  currency: string;
  saving: (id: number) => string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [paused]);
  function change(i: number) {
    setIndex((i + slides.length) % slides.length);
  }
  return (
    <section
      className="holiday-carousel"
      aria-roledescription="carousel"
      aria-label="Holiday bundle offers"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") change(index + 1);
        if (e.key === "ArrowLeft") change(index - 1);
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={"holiday-slide " + (index === i ? "current" : "")}
          aria-hidden={index !== i}
          inert={index !== i}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
        >
          <img
            src={s.image}
            alt={
              i === 2
                ? "Dog playing beside the ocean"
                : "Dogs enjoying the festive season"
            }
            loading="lazy"
          />
          <div className="holiday-shade" />
          <div className="holiday-copy">
            <span className="eyebrow">
              <PawPrint size={16} />
              {s.tag}
            </span>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <div className="holiday-offer">
              <strong>
                {money(s.price)} <small>{currency}</small>
              </strong>
              <span>
                Save {saving(s.id)} · {s.percent}%
              </span>
            </div>
            <a
              className="button orange"
              href={s.href}
              tabIndex={i === index ? 0 : -1}
            >
              {s.cta}
              <ArrowUpRight size={19} />
            </a>
            <small className="offer-note">
              Proposed holiday offer · Compared with items bought separately
            </small>
          </div>
        </div>
      ))}
      <div className="carousel-controls">
        <div className="carousel-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => change(i)}
              className={i === index ? "active" : ""}
              aria-label={`Show promotion ${i + 1}`}
              aria-pressed={i === index}
            />
          ))}
        </div>
        <span>{String(index + 1).padStart(2, "0")} / 03</span>
        <button
          aria-label="Previous promotion"
          onClick={() => change(index - 1)}
        >
          <ChevronLeft size={20} />
        </button>
        <button aria-label="Next promotion" onClick={() => change(index + 1)}>
          <ChevronRight size={20} />
        </button>
        {!reduced && (
          <button
            aria-label={paused ? "Play promotions" : "Pause promotions"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        )}
      </div>
    </section>
  );
}
export function AdventureVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (reduced || !visible) el.pause();
    else el.play().catch(() => undefined);
  }, [reduced, visible]);
  return (
    <section className="adventure-video" ref={section}>
      <img
        className="video-poster"
        src="/images/beach-poster.jpg"
        alt="A dog enjoying a day by the sea"
      />
      {!failed && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster="/images/beach-poster.jpg"
          onError={() => setFailed(true)}
          aria-label="Dog enjoying the beach"
        >
          <source src="/videos/beach-dog.mp4" type="video/mp4" />
        </video>
      )}
      <div className="video-shade" />
      <div className="video-copy">
        <span className="eyebrow">LESS SCROLLING. MORE STROLLING.</span>
        <h2>
          Go where the
          <br />
          <em>tail takes you.</em>
        </h2>
        <p>Pack the essentials. Make a day of it.</p>
        <a className="button orange" href="/shop/">
          Find your adventure gear <ArrowUpRight size={19} />
        </a>
      </div>
    </section>
  );
}
