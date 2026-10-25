"use client";

import React from "react";
import NavDrawer from "./NavDrawer";
import CarModal from "./CarModal";
import AppointmentModal from "./AppointmentModal";
import VideoModal from "./VideoModal";
import GalleryLightbox from "./GalleryLightbox";
import CompareModal from "./CompareModal";
import ShowroomStories from "./ShowroomStories";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

export default function ModalContainer({
  settings,
  branches,
}: {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
}) {
  return (
    <>
      <NavDrawer settings={settings} branches={branches} />
      <CarModal />
      <AppointmentModal />
      <VideoModal />
      <GalleryLightbox />
      <CompareModal />
      <ShowroomStories />
    </>
  );
}
