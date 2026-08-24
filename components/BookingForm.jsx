"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const COUNTRY_CODES = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+254", country: "Kenya" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+84", country: "Vietnam" },
];

const HOTEL_CATEGORIES = ["Standard", "Deluxe", "Luxury"];

const DESTINATIONS = [
  "Kerala", "Himachal Pradesh", "Ladakh", "Andaman", "Goa",
  "Kenya", "Vietnam", "Tanzania", "Iceland", "Sri Lanka", "Other",
];

const initialForm = {
  fullName: "", countryCode: "+91", contactNumber: "",
  email: "", dateOfTravel: "", numberOfPeople: 1,
  hotelCategory: "", numberOfChildren: 0,
  destination: "", message: "",
};

function validateForm(data) {
  const errors = {};
  if (!data.fullName.trim() || data.fullName.trim().length < 2)
    errors.fullName = "Full name is required (min 2 chars)";
  if (!data.email.trim() || !/^\S+@\S+\.\S+$/.test(data.email))
    errors.email = "Valid email address is required";
  if (!data.contactNumber.trim() || data.contactNumber.trim().length < 6)
    errors.contactNumber = "Valid contact number is required";
  if (!data.dateOfTravel) {
    errors.dateOfTravel = "Date of travel is required";
  } else {
    const travel = new Date(data.dateOfTravel);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (travel <= today) errors.dateOfTravel = "Travel date must be in the future";
  }
  if (!data.numberOfPeople || Number(data.numberOfPeople) < 1)
    errors.numberOfPeople = "At least 1 person required";
  if (!data.hotelCategory)
    errors.hotelCategory = "Please select a hotel category";
  if (Number(data.numberOfChildren) < 0)
    errors.numberOfChildren = "Cannot be negative";
  return errors;
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [apiMessage, setApiMessage] = useState("");

  // Prefill destination from query param
  useEffect(() => {
    const dest = searchParams?.get("destination");
    if (dest) setFormData((prev) => ({ ...prev, destination: dest }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setApiMessage(data.message);
        setFormData(initialForm);
        setErrors({});
      } else {
        setStatus("error");
        setApiMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setApiMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  if (status === "success") {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center animate-bounce-once">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Enquiry Submitted!</h3>
        <p className="text-slate-300 text-lg mb-2">{apiMessage}</p>
        <p className="text-slate-400 text-sm mb-8">We typically respond within 2–4 business hours.</p>
        <button
          onClick={() => { setStatus(null); setApiMessage(""); }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-200 hover:scale-105"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Error banner */}
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-300 text-sm">{apiMessage}</p>
        </div>
      )}

      {/* Row 1: Full Name */}
      <div data-error={errors.fullName ? "true" : undefined}>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="fullName" name="fullName" type="text"
          value={formData.fullName} onChange={handleChange}
          placeholder="John Doe"
          className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200 ${errors.fullName ? "border-red-500/70" : "border-white/10 hover:border-white/20"}`}
        />
        {errors.fullName && <p className="mt-1.5 text-red-400 text-xs">{errors.fullName}</p>}
      </div>

      {/* Row 2: Email */}
      <div data-error={errors.email ? "true" : undefined}>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          id="email" name="email" type="email"
          value={formData.email} onChange={handleChange}
          placeholder="john@example.com"
          className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200 ${errors.email ? "border-red-500/70" : "border-white/10 hover:border-white/20"}`}
        />
        {errors.email && <p className="mt-1.5 text-red-400 text-xs">{errors.email}</p>}
      </div>

      {/* Row 3: Phone with country code */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Contact Number <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2">
          <div className="relative">
          <select
            id="countryCode" name="countryCode"
            value={formData.countryCode} onChange={handleChange}
            className="w-36 appearance-none bg-slate-700/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="bg-slate-800 text-white py-2">
                {c.code} {c.country}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
          <div className="flex-1" data-error={errors.contactNumber ? "true" : undefined}>
            <input
              id="contactNumber" name="contactNumber" type="tel"
              value={formData.contactNumber} onChange={handleChange}
              placeholder="9876543210"
              className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.contactNumber ? "border-red-500/70" : "border-white/10 hover:border-white/20"}`}
            />
          </div>
        </div>
        {errors.contactNumber && <p className="mt-1.5 text-red-400 text-xs">{errors.contactNumber}</p>}
      </div>

      {/* Row 4: Date of travel */}
      <div data-error={errors.dateOfTravel ? "true" : undefined}>
        <label htmlFor="dateOfTravel" className="block text-sm font-medium text-slate-300 mb-1.5">
          Date of Travel <span className="text-red-400">*</span>
        </label>
        <input
          id="dateOfTravel" name="dateOfTravel" type="date"
          value={formData.dateOfTravel} onChange={handleChange}
          min={todayStr}
          className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200 ${errors.dateOfTravel ? "border-red-500/70" : "border-white/10 hover:border-white/20"}`}
        />
        {errors.dateOfTravel && <p className="mt-1.5 text-red-400 text-xs">{errors.dateOfTravel}</p>}
      </div>

      {/* Row 5: People + Children */}
      <div className="grid grid-cols-2 gap-4">
        <div data-error={errors.numberOfPeople ? "true" : undefined}>
          <label htmlFor="numberOfPeople" className="block text-sm font-medium text-slate-300 mb-1.5">
            No. of People <span className="text-red-400">*</span>
          </label>
          <input
            id="numberOfPeople" name="numberOfPeople" type="number"
            value={formData.numberOfPeople} onChange={handleChange}
            min="1" max="50"
            className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.numberOfPeople ? "border-red-500/70" : "border-white/10 hover:border-white/20"}`}
          />
          {errors.numberOfPeople && <p className="mt-1.5 text-red-400 text-xs">{errors.numberOfPeople}</p>}
        </div>
        <div data-error={errors.numberOfChildren ? "true" : undefined}>
          <label htmlFor="numberOfChildren" className="block text-sm font-medium text-slate-300 mb-1.5">
            No. of Children
          </label>
          <input
            id="numberOfChildren" name="numberOfChildren" type="number"
            value={formData.numberOfChildren} onChange={handleChange}
            min="0" max="20"
            className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.numberOfChildren ? "border-red-500/70" : "border-white/10 hover:border-white/20"}`}
          />
          {errors.numberOfChildren && <p className="mt-1.5 text-red-400 text-xs">{errors.numberOfChildren}</p>}
        </div>
      </div>

      {/* Row 6: Hotel Category */}
      <div data-error={errors.hotelCategory ? "true" : undefined}>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Hotel Category <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {HOTEL_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                formData.hotelCategory === cat
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-white/10 bg-slate-700/30 text-slate-400 hover:border-white/30"
              }`}
            >
              <input
                type="radio" name="hotelCategory" value={cat}
                checked={formData.hotelCategory === cat}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-lg">
                {cat === "Standard" ? "🏨" : cat === "Deluxe" ? "🌟" : "👑"}
              </span>
              <span className="text-sm font-medium">{cat}</span>
            </label>
          ))}
        </div>
        {errors.hotelCategory && <p className="mt-1.5 text-red-400 text-xs">{errors.hotelCategory}</p>}
      </div>

      {/* Row 7: Destination (optional) */}
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-slate-300 mb-1.5">
          Preferred Destination
        </label>
        <div className="relative">
        <select
          id="destination" name="destination"
          value={formData.destination} onChange={handleChange}
          className="w-full appearance-none bg-slate-700/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
        >
          <option value="" className="bg-slate-800 text-white py-2">Select a destination (optional)</option>
          {DESTINATIONS.map((d) => (
            <option key={d} value={d} className="bg-slate-800 text-white py-2">{d}</option>
          ))}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      </div>

      {/* Row 8: Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5">
          Additional Message
        </label>
        <textarea
          id="message" name="message"
          value={formData.message} onChange={handleChange}
          rows={3}
          placeholder="Special requirements, travel preferences, or questions..."
          className="w-full bg-slate-700/50 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <button
        id="submit-enquiry-btn"
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 text-base"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting your enquiry...
          </>
        ) : (
          <>
            <span>Submit Enquiry</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        🔒 Your information is secure and will never be shared with third parties.
      </p>
    </form>
  );
}
