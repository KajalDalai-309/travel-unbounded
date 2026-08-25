"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_OPTIONS = ["all", "New", "Contacted", "Converted", "Closed"];
const STATUS_COLORS = {
  New: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Converted: "bg-green-500/20 text-green-300 border-green-500/40",
  Closed: "bg-slate-500/20 text-slate-400 border-slate-500/40",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const router = useRouter();

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/enquiries?${params}`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    if (data.success) { setEnquiries(data.enquiries); setTotal(data.total); }
    setLoading(false);
  }, [search, statusFilter, router]);

  useEffect(() => {
    const timer = setTimeout(fetchEnquiries, 400);
    return () => clearTimeout(timer);
  }, [fetchEnquiries]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
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
    setUpdating(null);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900/90 border-r border-white/5 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">TU</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Travel Unbounded</p>
              <p className="text-slate-500 text-xs">Admin Portal</p>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { href: "/admin", label: "Dashboard", icon: "📊" },
              { href: "/admin/enquiries", label: "Enquiries", icon: "📋" },
              { href: "/admin/destinations", label: "Destinations", icon: "🌍" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${item.href === "/admin/enquiries" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-slate-300 hover:text-white hover:bg-white/5"}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm mb-2"><span>🌐</span> View Website</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"><span>🚪</span> Logout</button>
        </div>
      </div>

      {/* Main */}
      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Enquiries</h1>
            <p className="text-slate-400 mt-1">{total} total leads</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                  statusFilter === s
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-slate-800/60 border-white/10 text-slate-300 hover:border-white/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-300 font-semibold">No enquiries found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/5">
                  <tr>
                    {["Name & Contact", "Destination", "Date of Travel", "People", "Hotel", "Status", "Received"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white font-semibold text-sm">{enq.fullName}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{enq.email}</p>
                        <p className="text-slate-500 text-xs">{enq.countryCode} {enq.contactNumber}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{enq.destination || <span className="text-slate-600">—</span>}</td>
                      <td className="px-5 py-4 text-slate-300 text-sm">
                        {new Date(enq.dateOfTravel).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{enq.numberOfPeople} ({enq.numberOfChildren} child)</td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{enq.hotelCategory}</td>
                      <td className="px-5 py-4">
                        <select
                          value={enq.status || "New"}
                          onChange={(e) => updateStatus(enq._id, e.target.value)}
                          disabled={updating === enq._id}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer focus:outline-none disabled:opacity-50 transition-all ${STATUS_COLORS[enq.status || "New"]} bg-transparent`}
                        >
                          {["New", "Contacted", "Converted", "Closed"].map((s) => (
                            <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}