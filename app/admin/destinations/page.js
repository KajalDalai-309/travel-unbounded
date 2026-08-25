"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const fetchDestinations = async () => {
    const res = await fetch("/api/admin/destinations");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    if (data.success) setDestinations(data.destinations);
    setLoading(false);
  };

  useEffect(() => { fetchDestinations(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (dest) => {
    setForm({ ...dest, highlights: dest.highlights.join(", "), price: String(dest.price) });
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
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { setShowForm(false); fetchDestinations(); }
    else { alert("Error saving destination"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    setDeleting(id);
    await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    setDestinations((prev) => prev.filter((d) => d._id !== id));
    setDeleting(null);
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
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${item.href === "/admin/destinations" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-slate-300 hover:text-white hover:bg-white/5"}`}>
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

      <div className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Destinations</h1>
            <p className="text-slate-400 mt-1">{destinations.length} destinations</p>
          </div>
          <button onClick={openAdd} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Destination
          </button>
        </div>

        {/* Category tabs */}
        {["india", "international"].map((cat) => {
          const filtered = destinations.filter((d) => d.category === cat);
          return (
            <div key={cat} className="mb-8">
              <h2 className="text-lg font-bold text-slate-300 mb-4 capitalize flex items-center gap-2">
                {cat === "india" ? "🇮🇳" : "🌍"} {cat === "india" ? "India" : "International"} ({filtered.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((dest) => (
                  <div key={dest._id} className={`bg-slate-800/60 border ${dest.isActive ? "border-white/5" : "border-red-500/20"} rounded-2xl overflow-hidden group`}>
                    <div className="relative h-40">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      {!dest.isActive && (
                        <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                          <span className="text-red-300 font-bold text-sm bg-red-900/80 px-3 py-1 rounded-lg">Inactive</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-white font-bold">{dest.name}</h3>
                        <span className="text-amber-400 font-bold text-sm">₹{dest.price.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-1">{dest.duration}</p>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-4">{dest.description}</p>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(dest)} className="flex-1 bg-slate-700/50 hover:bg-amber-500/20 hover:text-amber-400 text-slate-300 text-sm font-semibold py-2 rounded-xl transition-all border border-white/5 hover:border-amber-500/30">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(dest._id)} disabled={deleting === dest._id} className="flex-1 bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 text-slate-300 text-sm font-semibold py-2 rounded-xl transition-all border border-white/5 hover:border-red-500/30 disabled:opacity-50">
                          {deleting === dest._id ? "..." : "🗑️ Delete"}
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-black text-white">{editingId ? "Edit Destination" : "Add New Destination"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Destination Name *</label>
                  <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" placeholder="e.g. Bali" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Country *</label>
                  <input required value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" placeholder="e.g. Indonesia" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm appearance-none cursor-pointer">
                    <option value="india">India</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Price (₹) *</label>
                  <input required type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" placeholder="e.g. 49999" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Duration *</label>
                <input required value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" placeholder="e.g. 7 Days / 6 Nights" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Image URL *</label>
                <input required value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" placeholder="https://images.unsplash.com/..." />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Description *</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none" placeholder="Short description of the destination..." />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Highlights (comma-separated)</label>
                <input value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" placeholder="Beach, Adventure, Culture" />
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span className="text-slate-300 text-sm">Active (visible on website)</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-800 text-slate-300 font-semibold py-3 rounded-xl border border-white/10 hover:bg-slate-700 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 transition-all">
                  {saving ? "Saving..." : editingId ? "Update Destination" : "Add Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}