"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const STATUS_OPTIONS = ["all", "New", "Contacted", "Converted", "Closed"];
const STATUS_COLORS = {
  New: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Closed: "bg-slate-500/20 text-slate-400 border-slate-500/40",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const pathname = usePathname();

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/admin/enquiries?${params}`);
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchEnquiries, 300);
    return () => clearTimeout(timer);
  }, [fetchEnquiries]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status } : e))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/enquiries", label: "Enquiries", icon: "📋" },
    { href: "/admin/destinations", label: "Destinations", icon: "🌍" },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1424] border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-black text-base">TU</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide">Travel Unbounded</p>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
          >
            <span>🌐</span>
            <span>Live Website</span>
            <span className="ml-auto text-[10px] text-slate-400">↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-semibold"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8 min-h-screen bg-[#070b14]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Enquiries & Leads</h1>
            <p className="text-slate-400 text-sm mt-1">Manage and track travel leads submitted from the website.</p>
          </div>
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs">
            {total} Total Leads
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d1424] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider ${
                  statusFilter === s
                    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-[#0d1424] border-white/10 text-slate-300 hover:border-white/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d1424] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-slate-400 text-xs">Loading enquiries...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-white font-bold text-base">No enquiries found</p>
              <p className="text-slate-400 text-xs mt-1">Try clearing your search query or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-white/5 bg-slate-900/60">
                  <tr>
                    {["Traveller Details", "Destination", "Travel Date", "Party Size", "Hotel", "Status Action", "Received"].map((h) => (
                      <th key={h} className="px-5 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-bold text-sm">{enq.fullName}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{enq.email}</p>
                        <p className="text-amber-400/80 text-xs font-mono mt-0.5">{enq.countryCode} {enq.contactNumber}</p>
                        {enq.message && (
                          <p className="text-slate-400 text-xs italic mt-1 bg-slate-900/40 p-1.5 rounded border border-white/5 max-w-xs">
                            &quot;{enq.message}&quot;
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-sm text-slate-200">{enq.destination || "Flexible"}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-sm">
                        {new Date(enq.dateOfTravel).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-sm">
                        <span className="font-bold text-white">{enq.numberOfPeople}</span> adults
                        {enq.numberOfChildren > 0 && <span className="text-slate-400 text-xs block">{enq.numberOfChildren} child</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300">
                          {enq.hotelCategory}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={enq.status || "New"}
                          onChange={(e) => updateStatus(enq._id, e.target.value)}
                          disabled={updating === enq._id}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none disabled:opacity-50 transition-all ${STATUS_COLORS[enq.status || "New"]} bg-slate-900`}
                        >
                          {["New", "Contacted", "Converted", "Closed"].map((s) => (
                            <option key={s} value={s} className="bg-slate-900 text-white font-normal">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}