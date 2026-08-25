"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const EMPTY_FORM = {
  name: "", country: "", category: "india", image: "", description: "",
  price: "", duration: "", highlights: "", isActive: true,
};

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const pathname = usePathname();

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/admin/destinations");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data.success) setDestinations(data.destinations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDestinations(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (dest) => {
    setForm({ ...dest, highlights: (dest.highlights || []).join(", "), price: String(dest.price) });
    setEditingId(dest._id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      highlights: form.highlights.split(",").map((h) => h.trim()).filter(Boolean),
    };
    const url = editingId ? `/api/admin/destinations/${editingId}` : "/api/admin/destinations";
    const method = editingId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        setShowForm(false);
        fetchDestinations();
      } else {
        alert("Error saving destination");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
      setDestinations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
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
            <h1 className="text-3xl font-black text-white tracking-tight">Destinations Manager</h1>
            <p className="text-slate-400 text-sm mt-1">Manage travel packages, pricing, images, and homepage destinations.</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <span>➕</span> Add New Destination
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-xs">Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 bg-[#0d1424] border border-white/10 rounded-2xl">
            <p className="text-5xl mb-4">🌍</p>
            <p className="text-white font-bold text-base">No destinations in database</p>
            <p className="text-slate-400 text-xs mt-1">Click above to add your first destination package</p>
          </div>
        ) : (
          <div className="space-y-10">
            {["india", "international"].map((cat) => {
              const filtered = destinations.filter((d) => d.category === cat);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                    <h2 className="text-base font-bold text-slate-200 capitalize flex items-center gap-2">
                      <span>{cat === "india" ? "🇮🇳" : "✈️"}</span>
                      <span>{cat === "india" ? "Domestic (India)" : "International Packages"}</span>
                    </h2>
                    <span className="text-xs text-slate-400 font-semibold bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                      {filtered.length} packages
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((dest) => (
                      <div
                        key={dest._id}
                        className={`bg-[#0d1424] border ${
                          dest.isActive ? "border-white/10" : "border-red-500/30"
                        } rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col group`}
                      >
                        <div className="relative h-44 overflow-hidden bg-slate-900">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <span className="bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
                              {dest.duration}
                            </span>
                            {!dest.isActive && (
                              <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                              ₹{dest.price?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                            <span className="text-xs text-slate-400 font-medium">{dest.country}</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                            {dest.description}
                          </p>

                          {dest.highlights && dest.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {dest.highlights.slice(0, 3).map((h, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-white/5"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 pt-3 border-t border-white/5 mt-auto">
                            <button
                              onClick={() => openEdit(dest)}
                              className="flex-1 bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 text-xs font-semibold py-2 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>✏️</span> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(dest._id)}
                              disabled={deleting === dest._id}
                              className="flex-1 bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-semibold py-2 rounded-xl border border-white/5 hover:border-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              <span>🗑️</span> {deleting === dest._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-white/15 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Destination" : "Add New Destination"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Destination Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="e.g. Bali"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Country *</label>
                  <input
                    required
                    value={form.country}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="e.g. Indonesia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="india">India</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Price (INR) *</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="49999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Duration *</label>
                <input
                  required
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. 7 Days / 6 Nights"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Image URL (Unsplash or direct) *</label>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  placeholder="Short engaging description of this trip package..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Highlights (comma separated)</label>
                <input
                  value={form.highlights}
                  onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="e.g. Scuba Diving, Beach Resort, Sunset Cruise"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-white/20 focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Active (Visible to users on homepage)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-3 rounded-xl border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                >
                  {saving ? "Saving..." : editingId ? "Update Destination" : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}