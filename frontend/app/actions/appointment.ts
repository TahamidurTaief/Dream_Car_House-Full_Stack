"use server";

import { getBackendOrigin } from "@/lib/server/api";

export interface AppointmentSubmissionInput {
  fullName: string;
  phone: string;
  interest?: string;
  branch?: string;
  date?: string;
  notes?: string;
}

export interface AppointmentSubmissionResult {
  ok: boolean;
  error?: string;
  data?: {
    id?: number | string;
    fullName: string;
    branchLabel: string;
    date: string;
    waUrl: string;
    duplicatePrevented?: boolean;
  };
}

// In-memory duplicate protection cache (server action lifecycle)
interface RecentSubmission {
  timestamp: number;
  id?: number | string;
  waUrl: string;
  branchLabel: string;
}
const recentSubmissions = new Map<string, RecentSubmission>();

// Clean up stale submissions older than 5 minutes periodically
function pruneSubmissions() {
  const now = Date.now();
  for (const [key, item] of recentSubmissions.entries()) {
    if (now - item.timestamp > 300_000) {
      recentSubmissions.delete(key);
    }
  }
}

export async function submitAppointmentEnquiryAction(
  input: AppointmentSubmissionInput
): Promise<AppointmentSubmissionResult> {
  try {
    pruneSubmissions();

    // 1. Sanitize & Validate inputs
    const fullName = (input.fullName || "").trim().replace(/[<>]/g, "");
    if (!fullName || fullName.length < 2) {
      return { ok: false, error: "Please enter your full name (minimum 2 characters)." };
    }
    if (fullName.length > 100) {
      return { ok: false, error: "Name must be 100 characters or fewer." };
    }

    const rawPhone = (input.phone || "").trim();
    // Validate phone number: 8 to 20 chars, optional + followed by digits, spaces, hyphens
    const phoneRe = /^[+0-9\s-]{8,20}$/;
    if (!rawPhone || !phoneRe.test(rawPhone)) {
      return {
        ok: false,
        error: "Please enter a valid phone number (at least 8 digits with country code or local format).",
      };
    }
    const cleanPhone = rawPhone;

    const interest = (input.interest || "Brand New & Reconditioned Import").trim().replace(/[<>]/g, "");
    const branchKey = (input.branch || "kakrail").trim().toLowerCase();
    const date = (input.date || "").trim();
    const notes = (input.notes || "").trim().replace(/[<>]/g, "").slice(0, 500);

    // Resolve branch label cleanly
    let branchLabel = "Kakrail Branch (18, Shaheed Captain Monsur Ali Soroni)";
    if (branchKey === "gulshan" || branchKey.includes("gulshan")) {
      branchLabel = "Gulshan Branch (House #07, Road #127, Gulshan Avenue)";
    }

    // 2. Generate WhatsApp URL
    const waAppointmentMsg = encodeURIComponent(
      `Hello DREAM CAR HOUSE Concierge,\n\nI have confirmed a VIP Private Consultation request:\n\n• Name: ${fullName}\n• Phone: ${cleanPhone}\n• Interest: ${interest}\n• Showroom Branch: ${branchLabel}\n• Preferred Date: ${date || "Earliest Available"}\n• Notes: ${notes || "General VIP Tour"}`
    );
    const waUrl = `https://wa.me/8801615121312?text=${waAppointmentMsg}`;

    // 3. Duplicate submit protection (key by phone + branchKey + date)
    const duplicateKey = `${cleanPhone}_${branchKey}_${date}`;
    const existing = recentSubmissions.get(duplicateKey);
    const now = Date.now();
    if (existing && now - existing.timestamp < 30_000) {
      // Return previous confirmation within 30s window without creating duplicate row
      return {
        ok: true,
        data: {
          id: existing.id,
          fullName,
          branchLabel: existing.branchLabel,
          date: date || "Earliest Available",
          waUrl: existing.waUrl,
          duplicatePrevented: true,
        },
      };
    }

    // 4. Determine Django topic
    const isSelling = interest.toLowerCase().includes("sell") || interest.toLowerCase().includes("trade");
    const topic = isSelling ? "SELLING" : "BUYING";

    const vehicleSummary = `VIP Reservation: ${branchLabel.split(" (")[0]} [${interest}]`;
    const messageBody = `Preferred Date: ${date || "Earliest Available"}\nNotes / Specific Query: ${
      notes || "None specified"
    }\nSubmitted via VIP Consultation Reservation Modal.`;

    // 5. Submit to Django ContactMessage endpoint
    const backendOrigin = getBackendOrigin();
    const res = await fetch(`${backendOrigin}/api/v1/home/contact/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        name: fullName,
        phone: cleanPhone,
        email: "",
        vehicle: vehicleSummary.slice(0, 150),
        enquiry: messageBody.slice(0, 3000),
        preferred_contact: "WHATSAPP",
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      let errMsg = "Unable to record your consultation reservation. Please try again or contact us directly.";
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
        // Fall back to default message
      }
      return { ok: false, error: errMsg };
    }

    const payload = await res.json();
    const recordId = payload?.data?.id || `APP-${Date.now()}`;

    // Cache to prevent duplicate submission
    recentSubmissions.set(duplicateKey, {
      timestamp: now,
      id: recordId,
      waUrl,
      branchLabel,
    });

    return {
      ok: true,
      data: {
        id: recordId,
        fullName,
        branchLabel,
        date: date || "Earliest Available",
        waUrl,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected server error occurred.";
    return { ok: false, error: errorMsg };
  }
}
