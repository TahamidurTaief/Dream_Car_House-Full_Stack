import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Location & Showroom Contact • Kakrail & Gulshan | DREAM CAR HOUSE",
  description:
    "Visit DREAM CAR HOUSE at 18 Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka and Gulshan Avenue. Call 01615-121312 for VIP luxury vehicle consultations.",
  alternates: {
    canonical: "https://dreamcarhouse.com/contact/",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
