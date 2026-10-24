"use client";

import React from "react";
import NavDrawer from "./NavDrawer";
import CarModal from "./CarModal";
import AppointmentModal from "./AppointmentModal";
import VideoModal from "./VideoModal";
import GalleryLightbox from "./GalleryLightbox";
import CompareModal from "./CompareModal";
import ShowroomStories from "./ShowroomStories";

export default function ModalContainer() {
  return (
    <>
      <NavDrawer />
      <CarModal />
      <AppointmentModal />
      <VideoModal />
      <GalleryLightbox />
      <CompareModal />
      <ShowroomStories />
    </>
  );
}
