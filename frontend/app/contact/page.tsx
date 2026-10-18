// app/contact/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSEOConfig, buildMetadata, isPageHidden } from "@/lib/seo";
import ContactForm from "./_components/ContactForm";
import OpeningHours from "./_components/OpeningHours";

const PHONE_DISPLAY = "+880 1966-900600";
const PHONE_RAW = "8801966900600";
const EMAIL = "contact@begautos.com";
const MAP_EMBED_URL =
  "https://maps.google.com/maps?width=600&height=400&hl=en&q=beg%20autos&t=&z=15&ie=UTF8&iwloc=B&output=embed";
const DIRECTIONS_URL = "https://maps.google.com/?q=beg+autos+dhaka";

const FALLBACK_METADATA: Metadata = {
  title: "Contact Us | BEG AUTOS",
  description:
    "Get in touch with BEG AUTOS in Baridhara, Dhaka. Call, WhatsApp or email our team about buying, selling or servicing your car.",
  robots: "index, follow",
  alternates: { canonical: "https://www.begautos.com/contact/" },
  openGraph: {
    title: "Contact Us | BEG AUTOS",
    description:
      "Call, WhatsApp or visit BEG AUTOS at Pragati Sarani, Baridhara, Dhaka.",
    url: "https://www.begautos.com/contact/",
    type: "website",
    siteName: "BEG AUTOS",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSEOConfig("contact");
  return { ...FALLBACK_METADATA, ...buildMetadata("contact", seo) };
}

const cardClass =
  "flex flex-col gap-3 bg-page border border-line rounded-lg p-6 text-ink transition-colors";
const eyebrowClass = "text-xs text-muted uppercase tracking-[0.08em] mt-2";

export default async function ContactPage() {
  const seo = await fetchSEOConfig("contact");
  if (isPageHidden(seo)) notFound();

  return (
    <>
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      <div className="dream-contact text-ink overflow-x-hidden">
        {/* Hero — compact (no photo) */}
        <section className="pt-[clamp(140px,16vw,180px)] px-10 pb-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-xl font-light mb-1">We&apos;d love to hear from you</p>
            <h1 className="text-5xl md:text-[64px] font-bold leading-tight">Contact Us</h1>
            <p className="text-sm text-muted max-w-xl mt-6 leading-relaxed">
              Whether you&apos;re looking for your next car, selling your current one
              or need help after the sale, our team in Baridhara is ready to help.
            </p>
          </div>
        </section>

        {/* Contact methods */}
        <section className="px-6 sm:px-10 mb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href={`tel:+${PHONE_RAW}`} className={`${cardClass} hover:border-line`}>
              <PhoneIcon />
              <p className={eyebrowClass}>Call Us</p>
              <p className="text-lg font-medium">{PHONE_DISPLAY}</p>
              <div className="w-16 h-px bg-soft" />
              <p className="text-sm text-muted">Speak directly with our sales team</p>
            </a>
            <a
              href={`https://wa.me/${PHONE_RAW}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${cardClass} hover:border-[#25d366]`}
            >
              <WhatsAppIcon />
              <p className={eyebrowClass}>WhatsApp</p>
              <p className="text-lg font-medium">Chat with us</p>
              <div className="w-16 h-px bg-soft" />
              <p className="text-sm text-muted">Stock updates and quick answers</p>
            </a>
            <a href={`mailto:${EMAIL}`} className={`${cardClass} hover:border-line`}>
              <MailIcon />
              <p className={eyebrowClass}>Email</p>
              <p className="text-lg font-medium break-all">{EMAIL}</p>
              <div className="w-16 h-px bg-soft" />
              <p className="text-sm text-muted">For detailed enquiries and documents</p>
            </a>
            <a href="#visit" className={`${cardClass} hover:border-line`}>
              <PinIcon />
              <p className={eyebrowClass}>Visit</p>
              <p className="text-lg font-medium">Pragati Sarani, Baridhara</p>
              <div className="w-16 h-px bg-soft" />
              <p className="text-sm text-muted">See the cars in person</p>
            </a>
          </div>
        </section>

        {/* Enquiry form + visit */}
        <section className="px-6 sm:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div>
              <h2 className="text-4xl font-bold mb-3 leading-tight">Send us a message</h2>
              <p className="text-muted text-sm leading-relaxed mb-8 max-w-lg">
                Tell us what you&apos;re looking for and the right person from our
                team will get back to you.
              </p>
              <ContactForm />
            </div>

            <div id="visit" className="flex flex-col gap-8 scroll-mt-24">
              <div className="relative w-full h-[300px] md:h-[420px] rounded-tr-3xl rounded-bl-3xl overflow-hidden bg-page">
                <iframe
                  title="BEG AUTOS location"
                  className="absolute inset-0 w-full h-full border-0"
                  src={MAP_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs text-muted uppercase tracking-[0.08em] mb-3">
                    Showroom
                  </p>
                  <address className="not-italic text-base leading-relaxed mb-5">
                    KA-61/6A Pragati Sarani
                    <br />
                    Baridhara, Dhaka-1212
                    <br />
                    Bangladesh
                  </address>
                  <a
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-ink rounded text-sm transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    Get Directions
                  </a>
                </div>
                <OpeningHours />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#25d366" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
