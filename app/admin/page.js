"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

function StatCard({ title, value, icon, color, sub, iconBg }) {
  return (
    <div className={`bg-slate-850/80 backdrop-blur-md border ${color} rounded-2xl p-6 flex items-start gap-4 transition-all hover:translate-y-[-2px] hover:shadow-xl`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconBg || "bg-slate-800"}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.success) setAnalytics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const statusColors = {
    New: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Closed: "bg-slate-500/20 text-slate-300 border-slate-500/30",
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

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen bg-[#070b14]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Overview Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time stats, leads overview, and website analytics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/enquiries"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-2"
            >
              <span>📋</span> View Enquiries
            </Link>
            <Link
              href="/admin/destinations"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <span>➕</span> Add Destination
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-4">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-slate-500 text-xs">Loading analytics data...</p>
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Enquiries"
                value={analytics.total}
                icon="📬"
                color="border-amber-500/30"
                iconBg="bg-amber-500/10 text-amber-400"
                sub="All time submissions"
              />
              <StatCard
                title="This Month"
                value={analytics.thisMonth}
                icon="📅"
                color="border-blue-500/30"
                iconBg="bg-blue-500/10 text-blue-400"
                sub={`${new Date().toLocaleString("default", { month: "long" })} activity`}
              />
              <StatCard
                title="Converted Bookings"
                value={analytics.statusCounts.find((s) => s._id === "Converted")?.count || 0}
                icon="✅"
                color="border-emerald-500/30"
                iconBg="bg-emerald-500/10 text-emerald-400"
                sub="Confirmed travellers"
              />
              <StatCard
                title="New Leads"
                value={analytics.statusCounts.find((s) => s._id === "New")?.count || 0}
                icon="🔔"
                color="border-purple-500/30"
                iconBg="bg-purple-500/10 text-purple-400"
                sub="Requires follow up"
              />
            </div>

            {/* 2 Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enquiry Status Breakdown */}
              <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <span>📊</span> Lead Status Pipeline
                  </h3>
                  <span className="text-xs text-slate-400">{analytics.total} Total</span>
                </div>
                <div className="space-y-4">
                  {["New", "Contacted", "Converted", "Closed"].map((status) => {
                    const count = analytics.statusCounts.find((s) => s._id === status)?.count || 0;
                    const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                    return (
                      <div key={status} className="bg-slate-900/60 border border-white/5 rounded-xl p-3.5">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className={`px-2.5 py-1 rounded-md border font-bold uppercase tracking-wider text-[10px] ${statusColors[status]}`}>
                            {status}
                          </span>
                          <span className="text-white font-bold">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              status === "New"
                                ? "bg-blue-500"
                                : status === "Contacted"
                                ? "bg-amber-500"
                                : status === "Converted"
                                ? "bg-emerald-500"
                                : "bg-slate-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Most Enquired Destinations */}
              <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <span>🔥</span> Most Popular Destinations
                  </h3>
                  <span className="text-xs text-slate-400">By enquiries</span>
                </div>
                {analytics.topDestinations.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topDestinations.map((dest, i) => (
                      <div
                        key={dest._id}
                        className="flex items-center justify-between bg-slate-900/60 border border-white/5 hover:border-amber-500/30 rounded-xl p-3.5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-amber-500/15 text-amber-400 rounded-lg flex items-center justify-center text-xs font-black border border-amber-500/30">
                            {i + 1}
                          </span>
                          <span className="text-white text-sm font-semibold">{dest._id || "Not specified"}</span>
                        </div>
                        <span className="text-amber-400 font-black text-sm bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                          {dest.count} {dest.count === 1 ? "lead" : "leads"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No destination enquiry data yet.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <Link
                href="/admin/enquiries"
                className="group bg-[#0d1424] border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition-all hover:translate-y-[-2px] flex items-center gap-5 shadow-lg"
              >
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  📋
                </div>
                <div>
                  <p className="text-white font-bold text-base">Enquiries Manager</p>
                  <p className="text-slate-400 text-xs mt-0.5">Filter leads, update contact status, view traveller details</p>
                </div>
                <span className="ml-auto text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all text-xl">→</span>
              </Link>
              <Link
                href="/admin/destinations"
                className="group bg-[#0d1424] border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 transition-all hover:translate-y-[-2px] flex items-center gap-5 shadow-lg"
              >
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🌍
                </div>
                <div>
                  <p className="text-white font-bold text-base">Destinations Manager</p>
                  <p className="text-slate-400 text-xs mt-0.5">Add packages, edit pricing, manage images and descriptions</p>
                </div>
                <span className="ml-auto text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all text-xl">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">Failed to load analytics data.</div>
        )}
      </main>
    </div>
  );
}