"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatCard({ title, value, icon, color, sub }) {
  return (
    <div className={`bg-slate-800/60 border ${color} rounded-2xl p-6 flex items-start gap-4`}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-700/50">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-3xl font-black text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.success) setAnalytics(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const statusColors = {
    New: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Converted: "bg-green-500/20 text-green-300 border-green-500/30",
    Closed: "bg-slate-500/20 text-slate-300 border-slate-500/30",
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
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm mb-2">
            <span>🌐</span> View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here is what is happening.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : analytics ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard title="Total Enquiries" value={analytics.total} icon="📬" color="border-amber-500/30" sub="All time" />
              <StatCard title="This Month" value={analytics.thisMonth} icon="📅" color="border-blue-500/30" sub={new Date().toLocaleString("default", { month: "long" })} />
              <StatCard
                title="Converted"
                value={analytics.statusCounts.find((s) => s._id === "Converted")?.count || 0}
                icon="✅"
                color="border-green-500/30"
                sub="Successful bookings"
              />
              <StatCard
                title="New Leads"
                value={analytics.statusCounts.find((s) => s._id === "New")?.count || 0}
                icon="🔔"
                color="border-purple-500/30"
                sub="Awaiting contact"
              />
            </div>

            {/* Two column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Enquiry Status Breakdown</h3>
                <div className="space-y-3">
                  {["New", "Contacted", "Converted", "Closed"].map((status) => {
                    const count = analytics.statusCounts.find((s) => s._id === status)?.count || 0;
                    const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`px-2 py-0.5 rounded-lg border text-xs font-semibold ${statusColors[status]}`}>{status}</span>
                          <span className="text-slate-300">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              status === "New" ? "bg-blue-500" :
                              status === "Contacted" ? "bg-amber-500" :
                              status === "Converted" ? "bg-green-500" : "bg-slate-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Destinations */}
              <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Most Enquired Destinations</h3>
                {analytics.topDestinations.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topDestinations.map((dest, i) => (
                      <div key={dest._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-slate-300 text-sm">{dest._id || "Not specified"}</span>
                        </div>
                        <span className="text-amber-400 font-bold text-sm">{dest.count} enquiries</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No destination data yet.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/enquiries" className="flex items-center gap-4 bg-slate-800/60 border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 transition-all group">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📋</div>
                <div>
                  <p className="text-white font-bold">Manage Enquiries</p>
                  <p className="text-slate-400 text-sm">View, filter and update leads</p>
                </div>
                <svg className="w-5 h-5 text-slate-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/admin/destinations" className="flex items-center gap-4 bg-slate-800/60 border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 transition-all group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🌍</div>
                <div>
                  <p className="text-white font-bold">Manage Destinations</p>
                  <p className="text-slate-400 text-sm">Add, edit or remove destinations</p>
                </div>
                <svg className="w-5 h-5 text-slate-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-slate-400">Could not load analytics data.</p>
        )}
      </div>
    </div>
  );
}