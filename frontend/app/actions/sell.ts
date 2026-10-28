"use server";

import { getBackendOrigin, getSiteSettings } from "@/lib/server/api";

export interface SellCarSubmissionInput {
  name: string;
  phone: string;
  carName: string;
  carModel: string;
  carYear: string;
  mileage: number | string;
  offeredPrice?: number | string;
  notes?: string;
}

export interface SellCarSubmissionResult {
  ok: boolean;
  error?: string;
  data?: {
    id?: number | string;
    waUrl?: string;
  };
}

export async function submitSellCarAction(
  input: SellCarSubmissionInput
): Promise<SellCarSubmissionResult> {
  try {
    const name = (input.name || "").trim().replace(/[<>]/g, "");
    if (!name || name.length < 2) {
      return { ok: false, error: "Please enter your name (minimum 2 characters)." };
    }

    const rawPhone = (input.phone || "").trim();
    const phoneRe = /^[+0-9\s-]{8,20}$/;
    if (!rawPhone || !phoneRe.test(rawPhone)) {
      return {
        ok: false,
        error: "Please enter a valid phone number (at least 8 digits with country code or local format).",
      };
    }

    const carName = (input.carName || "").trim().replace(/[<>]/g, "");
    if (!carName) {
      return { ok: false, error: "Please enter vehicle manufacturer or brand." };
    }

    const carModel = (input.carModel || "").trim().replace(/[<>]/g, "");
    if (!carModel) {
      return { ok: false, error: "Please enter vehicle model." };
    }

    const carYear = (input.carYear || "").trim().replace(/[<>]/g, "");
    if (!carYear) {
      return { ok: false, error: "Please enter production year." };
    }

    const rawMileage = String(input.mileage || "").replace(/[^0-9]/g, "");
    const mileageNum = parseInt(rawMileage, 10);
    if (isNaN(mileageNum) || mileageNum < 0) {
      return { ok: false, error: "Please enter valid mileage in km." };
    }

    let offeredPriceNum: number | null = null;
    if (input.offeredPrice) {
      const parsedPrice = parseInt(String(input.offeredPrice).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        offeredPriceNum = parsedPrice;
      }
    }

    // Resolve concierge phone for WhatsApp link
    let targetPhone = "";
    try {
      const settings = await getSiteSettings();
      targetPhone = settings?.whatsapp || settings?.hotline || "";
    } catch {
      // ignore
    }

    const waMsg = encodeURIComponent(
      `Hello DREAM CAR HOUSE Valuation Desk,\n\nI have submitted my luxury car for trade-in / valuation:\n\n• Name: ${name}\n• Phone: ${rawPhone}\n• Brand: ${carName}\n• Model: ${carModel}\n• Year: ${carYear}\n• Mileage: ${mileageNum.toLocaleString()} km${
        offeredPriceNum ? `\n• Expected Price: BDT ${offeredPriceNum.toLocaleString()}` : ""
      }${input.notes ? `\n• Notes: ${input.notes}` : ""}`
    );

    const cleanDigits = targetPhone.replace(/[^0-9]/g, "");
    let waPhone = cleanDigits;
    if (waPhone.startsWith("0")) {
      waPhone = "88" + waPhone;
    } else if (!waPhone.startsWith("880") && waPhone.length === 10) {
      waPhone = "880" + waPhone;
    }
    const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${waMsg}` : "";

    // Submit to Django Backend endpoint /api/v1/home/sell-car/
    const origin = getBackendOrigin();
    const payload: Record<string, unknown> = {
      name,
      phone: rawPhone,
      car_name: carName,
      car_model: carModel,
      car_year: carYear,
      mileage: mileageNum,
    };
    if (offeredPriceNum) {
      payload.offered_price = offeredPriceNum;
    }

    const res = await fetch(`${origin}/api/v1/home/sell-car/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      let errMsg = "Unable to submit your car details. Please try again or reach out on WhatsApp.";
      try {
        const errorData = await res.json();
        if (errorData?.errors && typeof errorData.errors === "object") {
          const firstErrKey = Object.keys(errorData.errors)[0];
          const firstErrVal = errorData.errors[firstErrKey];
          errMsg = Array.isArray(firstErrVal) ? firstErrVal[0] : String(firstErrVal);
        } else if (errorData?.message) {
          errMsg = errorData.message;
        }
      } catch {
        // fallback
      }
      return { ok: false, error: errMsg };
    }

    const resJson = await res.json();
    const recordId = resJson?.id || resJson?.data?.id || `SELL-${Date.now()}`;

    return {
      ok: true,
      data: {
        id: recordId,
        waUrl,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected server error occurred.";
    return { ok: false, error: errorMsg };
  }
}
