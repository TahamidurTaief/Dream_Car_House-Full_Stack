"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface InventoryItem {
  id: number;
  name: string;
  count: string;
  image: string;
  href: string;
}

const inventoryItems: InventoryItem[] = [
  { id: 1, name: "Hatchback", count: "271 Car", image: "/assets/images/section/car-slide1.png", href: "/listing-grid" },
  { id: 2, name: "Sedan", count: "348 Car", image: "/assets/images/section/car-slide2.png", href: "/listing-grid" },
  { id: 3, name: "SUV", count: "512 Car", image: "/assets/images/section/car-slide3.png", href: "/listing-grid" },
  { id: 4, name: "Coupe", count: "189 Car", image: "/assets/images/section/car-slide1.png", href: "/listing-grid" },
  { id: 5, name: "Convertible", count: "142 Car", image: "/assets/images/section/car-slide2.png", href: "/listing-grid" },
  { id: 6, name: "Crossover", count: "295 Car", image: "/assets/images/section/car-slide3.png", href: "/listing-grid" },
];

export default function ExploreInventorySlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    type SwiperConstructor = new (
      element: HTMLElement | string,
      options: Record<string, unknown>
    ) => { destroy: (deleteInstance: boolean, cleanStyles: boolean) => void };

    let swiperInstance: { destroy: (deleteInstance: boolean, cleanStyles: boolean) => void } | null = null;

    const init = () => {
      const win = window as unknown as { Swiper?: SwiperConstructor };
      if (!win.Swiper || !sliderRef.current) return;

      try {
        swiperInstance = new win.Swiper(sliderRef.current, {
          slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 40,
          centeredSlides: true,
          centeredSlidesBounds: true,
          observer: true,
          observeParents: true,
          speed: 1000,
          loop: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          navigation: {
            nextEl: nextRef.current || ".swiper-button-next.style-2",
            prevEl: prevRef.current || ".swiper-button-prev.style-2",
          },
          breakpoints: {
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 40,
            },
          },
        });
      } catch (err) {
        console.error("ExploreInventorySlider init error:", err);
      }
    };

    const win = window as unknown as { Swiper?: SwiperConstructor };
    if (!win.Swiper) {
      const script = document.createElement("script");
      script.src = "/app/js/swiper-bundle.min.js";
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }

    return () => {
      if (swiperInstance) {
        try {
          swiperInstance.destroy(true, true);
        } catch {}
      }
    };
  }, []);

  return (
    <div className="relative">
      <div dir="ltr" ref={sliderRef} className="swiper listing-slide overflow-hidden">
        <div className="swiper-wrapper">
          {inventoryItems.map((item) => (
            <div key={item.id} className="swiper-slide">
              <Link href={item.href} className="tf-listing-slide" style={{ textDecoration: "none", display: "block" }}>
                <div className="img-style">
                  <img
                    className="lazyload"
                    data-src={item.image}
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="content-style center">
                  <div className="fs-16 fw-6 lh-22 text-color-2 font-2">{item.name}</div>
                  <p className="fs-12">{item.count}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div ref={prevRef} className="swiper-button-prev style-2"></div>
        <div ref={nextRef} className="swiper-button-next style-2"></div>
      </div>
    </div>
  );
}
