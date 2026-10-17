// app/sell/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSEOConfig, buildMetadata, isPageHidden } from "@/lib/seo";
import SellYourCarClient from "./_components/SellYourCarClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSEOConfig("sell");
  return buildMetadata("sell", seo);
}

export default async function SellYourCar() {
  const seo = await fetchSEOConfig("sell");
  if (isPageHidden(seo)) notFound();

  return (
    <>
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      <SellYourCarClient />
    </>
  );
}
