"use client";

import { useEffect, useRef, useState } from "react";

const PROSE =
  "text-muted text-sm leading-relaxed [&_h2]:text-ink [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-ink [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:underline [&_a]:text-ink [&_strong]:text-ink";

/** Short intro rendered directly above the car grid. */
export function CategoryShortDescription({ html }: { html: string }) {
  return (
    <div
      className={`${PROSE} max-w-4xl mb-8`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Long description rendered below the pagination, clamped to COLLAPSED_PX
 * with a "See more" toggle. The full HTML is always in the DOM — we clamp
 * visually rather than truncating the string, so tags are never cut in half
 * and search engines still see the complete text.
 */
export function CategoryLongDescription({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const COLLAPSED_PX = 200;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const check = () => setOverflows(el.scrollHeight > COLLAPSED_PX + 24);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [html]);

  return (
    <section className="pb-10 mt-10 border-t border-line pt-8">
      <div className="relative w-full">
        <div
          ref={contentRef}
          className={`${PROSE} w-full overflow-hidden transition-[max-height] duration-300`}
          style={{ maxHeight: expanded ? "none" : `${COLLAPSED_PX}px` }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && overflows && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-page to-transparent" />
        )}
      </div>

      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 text-sm font-medium text-ink underline underline-offset-4 hover:text-muted"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </section>
  );
}
