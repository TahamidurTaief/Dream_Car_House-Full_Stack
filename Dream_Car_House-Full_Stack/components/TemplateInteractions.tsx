"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TemplateInteractions() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Preloader dismissal
    const dismissPreloader = () => {
      const preloader = document.querySelectorAll(".preload, .preload-container");
      preloader.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.transition = "opacity 0.4s ease";
        htmlEl.style.opacity = "0";
        setTimeout(() => {
          htmlEl.style.display = "none";
        }, 400);
      });
    };
    dismissPreloader();
    const fallbackTimer = setTimeout(dismissPreloader, 350);

    // 2. Sticky Header handler
    const onScroll = () => {
      const scrollY = window.scrollY;
      const headerLower = document.querySelector(".header-lower");
      if (headerLower) {
        if (scrollY > 100) {
          headerLower.classList.add("is-fixed");
        } else {
          headerLower.classList.remove("is-fixed");
        }
        if (scrollY > 300) {
          headerLower.classList.add("is-small");
        } else {
          headerLower.classList.remove("is-small");
        }
      }

      // 3. Back to Top Progress Wrap
      const progressWrap = document.querySelector(".progress-wrap");
      const progressPath = document.querySelector(".progress-wrap path") as SVGPathElement | null;
      if (progressWrap) {
        if (scrollY > 150) {
          progressWrap.classList.add("active-progress");
        } else {
          progressWrap.classList.remove("active-progress");
        }
        if (progressPath) {
          try {
            const pathLength = progressPath.getTotalLength();
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height > 0) {
              const progress = pathLength - (scrollY * pathLength) / height;
              progressPath.style.strokeDashoffset = `${progress}`;
            }
          } catch {}
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 4. Back to top click
    const handleProgressClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".progress-wrap");
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleProgressClick);

    // 5. Mobile Nav Toggle
    const handleMobileToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".mobile-nav-toggler, .mobile-button")) {
        e.preventDefault();
        document.body.classList.toggle("mobile-menu-visible");
      } else if (
        target.closest(".mobile-menu .menu-backdrop") ||
        target.closest(".mobile-menu .close-btn") ||
        target.closest(".close-btn")
      ) {
        e.preventDefault();
        document.body.classList.remove("mobile-menu-visible");
      }
    };
    document.addEventListener("click", handleMobileToggle);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.classList.remove("mobile-menu-visible");
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // 6. Mobile Submenu Toggle
    const handleSubmenuToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(".dropdown2-btn")) {
        e.preventDefault();
        const parentLi = target.closest("li");
        if (parentLi) {
          parentLi.classList.toggle("open");
          const childUl = parentLi.querySelector(":scope > ul") as HTMLElement | null;
          if (childUl) {
            if (childUl.style.display === "block") {
              childUl.style.display = "none";
            } else {
              childUl.style.display = "block";
            }
          }
        }
      }
    };
    document.addEventListener("click", handleSubmenuToggle);

    // 7. Tabs
    const handleTabClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".menu-tab > li") as HTMLElement | null;
      if (!target) return;
      const flatTabs = target.closest(".flat-tabs");
      if (!flatTabs) return;

      e.preventDefault();
      const menuTabItems = Array.from(flatTabs.querySelectorAll(".menu-tab > li"));
      const index = menuTabItems.indexOf(target);
      if (index === -1) return;

      menuTabItems.forEach((li) => li.classList.remove("active"));
      target.classList.add("active");

      const contentTab = flatTabs.querySelector(".content-tab");
      if (contentTab) {
        const panes = Array.from(contentTab.children) as HTMLElement[];
        panes.forEach((pane, i) => {
          if (i === index) {
            pane.classList.add("active");
            pane.style.display = "block";
          } else {
            pane.classList.remove("active");
            pane.style.display = "none";
          }
        });
      }
    };
    document.addEventListener("click", handleTabClick);

    // 8. Accordions
    const handleAccordionClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".toggle-title") as HTMLElement | null;
      if (target) {
        e.preventDefault();
        target.classList.toggle("active");
        const nextContent = target.nextElementSibling as HTMLElement | null;
        if (nextContent) {
          if (target.classList.contains("active")) {
            nextContent.style.display = "block";
          } else {
            nextContent.style.display = "none";
          }
        }
      }

      // Handle avatar browse button in account profile
      const browseBtn = (e.target as HTMLElement).closest("#btnBrowse");
      if (browseBtn) {
        e.preventDefault();
        (document.getElementById("tfcl_avatar") as HTMLElement | null)?.click();
      }
    };
    document.addEventListener("click", handleAccordionClick);

    // 9. Modals (Bootstrap data-bs-toggle="modal" / data-bs-dismiss="modal")
    const handleModalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest('[data-bs-toggle="modal"]') as HTMLElement | null;
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute("data-bs-target") || trigger.getAttribute("href");
        if (modalId && modalId.startsWith("#")) {
          const modalEl = document.querySelector(modalId) as HTMLElement | null;
          if (modalEl) {
            modalEl.classList.add("show");
            modalEl.style.display = "block";
            modalEl.removeAttribute("aria-hidden");
            modalEl.setAttribute("aria-modal", "true");
            document.body.classList.add("modal-open");

            if (!document.querySelector(".modal-backdrop")) {
              const backdrop = document.createElement("div");
              backdrop.className = "modal-backdrop fade show";
              document.body.appendChild(backdrop);
            }
          }
        }
      }

      const dismiss = target.closest('[data-bs-dismiss="modal"], .btn-close') as HTMLElement | null;
      if (dismiss) {
        e.preventDefault();
        const openModals = document.querySelectorAll(".modal.show");
        openModals.forEach((m) => {
          m.classList.remove("show");
          (m as HTMLElement).style.display = "none";
          m.setAttribute("aria-hidden", "true");
        });
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
      }
    };
    document.addEventListener("click", handleModalClick);

    // 10. Forms Interception (Requirement 6: Standalone Presentation Demo)
    const handleFormSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      
      let msgContainer = form.querySelector(".flat-alert, .form-message-alert, #subscribe-msg") as HTMLElement | null;
      if (!msgContainer) {
        msgContainer = document.createElement("div");
        msgContainer.className = "flat-alert msg-info";
        msgContainer.style.margin = "12px 0";
        msgContainer.style.padding = "10px 14px";
        msgContainer.style.backgroundColor = "#fff3cd";
        msgContainer.style.border = "1px solid #ffeeba";
        msgContainer.style.color = "#856404";
        msgContainer.style.borderRadius = "8px";
        msgContainer.style.fontSize = "14px";
        form.prepend(msgContainer);
      }
      msgContainer.textContent = "Form submission is not configured in this standalone presentation demo.";
      msgContainer.style.display = "block";
    };
    document.addEventListener("submit", handleFormSubmit);

    // 11. Swiper Sliders
    type SwiperType = new (element: Element | string, options: Record<string, unknown>) => { destroy: (deleteInstance: boolean, cleanStyles: boolean) => void };
    let swiperInstances: { destroy: (deleteInstance: boolean, cleanStyles: boolean) => void }[] = [];

    const setupSwiperSliders = (SwiperClass: SwiperType) => {
      if (!SwiperClass) return;

      swiperInstances.forEach((inst) => {
        try { inst.destroy(true, true); } catch {}
      });
      swiperInstances = [];

      // Listing slide (Explore Inventory / Car by Body) - Auto slider 1-by-1 every 3-5 sec
      document.querySelectorAll(".listing-slide:not(.swiper-initialized)").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
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
              nextEl: el.querySelector(".swiper-button-next") || ".swiper-button-next.style-2",
              prevEl: el.querySelector(".swiper-button-prev") || ".swiper-button-prev.style-2",
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
          swiperInstances.push(s);
        } catch {}
      });

      // Carousel 2 (Car listing cards image carousel)
      document.querySelectorAll(".carousel-2").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
            slidesPerView: 1,
            observer: true,
            observeParents: true,
            navigation: {
              nextEl: el.querySelector(".swiper-button-next2"),
              prevEl: el.querySelector(".swiper-button-prev2"),
            },
            pagination: {
              el: el.querySelector(".swiper-pagination2"),
              clickable: true,
            },
          });
          swiperInstances.push(s);
        } catch {}
      });

      // Carousel 3 (Review car)
      document.querySelectorAll(".review-car.carousel-3").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
            slidesPerView: 1,
            speed: 500,
            effect: "fade",
            fadeEffect: { crossFade: true },
            navigation: {
              nextEl: ".swiper-button-next.style-1",
              prevEl: ".swiper-button-prev.style-1",
            },
          });
          swiperInstances.push(s);
        } catch {}
      });

      // Partner slide 3 (Brands)
      document.querySelectorAll(".partner-slide3").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
            slidesPerView: 2,
            spaceBetween: 20,
            observer: true,
            observeParents: true,
            pagination: {
              el: el.parentElement?.querySelector(".swiper-pagination3") || ".swiper-pagination3",
              clickable: true,
            },
            breakpoints: {
              575: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 24 },
              992: { slidesPerView: 6, spaceBetween: 30 },
              1200: { slidesPerView: 7, spaceBetween: 30 },
            },
          });
          swiperInstances.push(s);
        } catch {}
      });

      // Carousel 5 (Logos marquee)
      document.querySelectorAll(".carousel-5").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
            slidesPerView: 2,
            loop: true,
            spaceBetween: 30,
            speed: 6000,
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
            },
            breakpoints: {
              575: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
              1200: { slidesPerView: 6 },
            },
          });
          swiperInstances.push(s);
        } catch {}
      });

      // Carousel 6 (Testimonials)
      document.querySelectorAll(".carousel-6").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
            slidesPerView: 1,
            loop: true,
            spaceBetween: 30,
            centeredSlides: true,
            pagination: {
              el: el.parentElement?.querySelector(".swiper-pagination3") || ".swiper-pagination3",
              clickable: true,
            },
            breakpoints: {
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            },
          });
          swiperInstances.push(s);
        } catch {}
      });

      // TF SW Mobile
      document.querySelectorAll(".tf-sw-mobile").forEach((el) => {
        try {
          const s = new SwiperClass(el, {
            slidesPerView: 1,
            spaceBetween: 15,
            observer: true,
            observeParents: true,
            pagination: {
              el: el.parentElement?.querySelector(".swiper-pagination3") || ".swiper-pagination3",
              clickable: true,
            },
            breakpoints: {
              575: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 15 },
              1150: { slidesPerView: 3, spaceBetween: 30 },
            },
          });
          swiperInstances.push(s);
        } catch {}
      });
    };

    const win = window as unknown as { Swiper?: SwiperType };
    if (!win.Swiper) {
      const script = document.createElement("script");
      script.src = "/app/js/swiper-bundle.min.js";
      script.onload = () => {
        if (win.Swiper) {
          setupSwiperSliders(win.Swiper);
        }
      };
      document.body.appendChild(script);
    } else {
      setupSwiperSliders(win.Swiper);
    }

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", handleProgressClick);
      document.removeEventListener("click", handleMobileToggle);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleSubmenuToggle);
      document.removeEventListener("click", handleTabClick);
      document.removeEventListener("click", handleAccordionClick);
      document.removeEventListener("click", handleModalClick);
      document.removeEventListener("submit", handleFormSubmit);
      swiperInstances.forEach((inst) => {
        try { inst.destroy(true, true); } catch {}
      });
    };
  }, [pathname]);

  return null;
}
