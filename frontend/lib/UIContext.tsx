"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Vehicle, GalleryPhoto } from "./showroomData";

interface UIContextType {
  // Navigation Drawer
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  // Car Detail Modal
  selectedCar: Vehicle | null;
  openCarModal: (car: Vehicle) => void;
  closeCarModal: () => void;

  // Appointment Modal
  isAppointmentOpen: boolean;
  appointmentPrefill: { carName?: string; carYear?: number; branchId?: string };
  openAppointmentModal: (prefill?: { carName?: string; carYear?: number; branchId?: string }) => void;
  closeAppointmentModal: () => void;

  // Video Lightbox Modal
  activeVideo: "reel" | "tour" | null;
  openVideoModal: (type: "reel" | "tour") => void;
  closeVideoModal: () => void;

  // Gallery Lightbox Modal
  galleryLightboxIndex: number | null;
  galleryPhotos: GalleryPhoto[];
  openGalleryLightbox: (index: number, photos?: GalleryPhoto[]) => void;
  closeGalleryLightbox: () => void;

  // Compare Modal
  isCompareOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentPrefill, setAppointmentPrefill] = useState<{
    carName?: string;
    carYear?: number;
    branchId?: string;
  }>({});
  const [activeVideo, setActiveVideo] = useState<"reel" | "tour" | null>(null);
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState<number | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const openCarModal = (car: Vehicle) => setSelectedCar(car);
  const closeCarModal = () => setSelectedCar(null);

  const openAppointmentModal = (prefill?: { carName?: string; carYear?: number; branchId?: string }) => {
    setAppointmentPrefill(prefill || {});
    setIsAppointmentOpen(true);
  };
  const closeAppointmentModal = () => {
    setIsAppointmentOpen(false);
    setAppointmentPrefill({});
  };

  const openVideoModal = (type: "reel" | "tour") => setActiveVideo(type);
  const closeVideoModal = () => setActiveVideo(null);

  const openGalleryLightbox = (index: number, photos?: GalleryPhoto[]) => {
    if (photos) setGalleryPhotos(photos);
    setGalleryLightboxIndex(index);
  };
  const closeGalleryLightbox = () => setGalleryLightboxIndex(null);

  const openCompareModal = () => setIsCompareOpen(true);
  const closeCompareModal = () => setIsCompareOpen(false);

  // Lock body scroll when any modal or drawer is open
  useEffect(() => {
    const isAnyOpen =
      isDrawerOpen ||
      selectedCar !== null ||
      isAppointmentOpen ||
      activeVideo !== null ||
      galleryLightboxIndex !== null ||
      isCompareOpen;

    if (isAnyOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, selectedCar, isAppointmentOpen, activeVideo, galleryLightboxIndex, isCompareOpen]);

  // Handle ESC key globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (galleryLightboxIndex !== null) closeGalleryLightbox();
        else if (selectedCar !== null) closeCarModal();
        else if (isAppointmentOpen) closeAppointmentModal();
        else if (activeVideo !== null) closeVideoModal();
        else if (isCompareOpen) closeCompareModal();
        else if (isDrawerOpen) closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryLightboxIndex, selectedCar, isAppointmentOpen, activeVideo, isCompareOpen, isDrawerOpen]);

  return (
    <UIContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        selectedCar,
        openCarModal,
        closeCarModal,
        isAppointmentOpen,
        appointmentPrefill,
        openAppointmentModal,
        closeAppointmentModal,
        activeVideo,
        openVideoModal,
        closeVideoModal,
        galleryLightboxIndex,
        galleryPhotos,
        openGalleryLightbox,
        closeGalleryLightbox,
        isCompareOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
