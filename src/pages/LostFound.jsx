import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  PackageSearch,
  Calendar,
  MapPin
} from "lucide-react";
import { fetchLostFound, createLostFound, submitItemClaim } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Toast from "../components/Toast.jsx";
import Modal from "../components/Modal.jsx";

const CATEGORIES = ["All", "Electronics", "Documents", "Clothing", "Keys", "Wallets", "Accessories", "Other"];

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const [toast, setToast] = useState(null);

  const [reportForm, setReportForm] = useState({
    title: "",
    type: "Lost",
    category: "Electronics",
    description: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    image: ""
  });

  const [claimForm, setClaimForm] = useState({
    studentName: "Aditya Roy",
    studentId: "22CS089",
    contactNumber: "+91 98765 43210",
    proofDescription: ""
  });

  useEffect(() => {
    let isMounted = true;
    fetchLostFound().then((data) => {
      if (isMounted) {
        setItems(data || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportForm({ ...reportForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.location) {
      showToast("error", "Please provide item name and location.");
      return;
    }

    const created = await createLostFound(reportForm);
    if (created) {
      setItems([created, ...items]);
      setIsReportModalOpen(false);
      setReportForm({
        title: "",
        type: "Lost",
        category: "Electronics",
        description: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        image: ""
      });
      showToast("success", `Report for "${created.title}" published!`);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!claimForm.proofDescription) {
      showToast("error", "Please provide ownership proof details.");
      return;
    }

    const updated = await submitItemClaim(selectedClaimItem.id, claimForm);
    if (updated) {
      setItems(items.map(i => (i.id === selectedClaimItem.id ? updated : i)));
      setSelectedClaimItem(null);
      setClaimForm({ studentName: "Aditya Roy", studentId: "22CS089", contactNumber: "+91 98765 43210", proofDescription: "" });
      showToast("success", "Ownership claim submitted! Campus security will review.");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Claimed" ? item.status === "Returned" || item.status === "Claimed" || item.status === "Verified" : item.type === typeFilter);

    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
            <PackageSearch className="w-8 h-8 text-indigo-600" />
            Lost & Found Portal
          </h1>
          <p className="text-neutral-500 mt-1">
            Report misplaced items, claim discovered property, and track ownership verification status.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" /> Report Item
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="relative col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by item name, location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex bg-neutral-100 p-1 rounded-xl">
          {["All", "Lost", "Found", "Claimed"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === t ? "bg-white text-indigo-600 shadow-xs" : "text-neutral-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Item Grid */}
      {loading ? (
        <div className="py-20 text-center text-neutral-400">Loading lost & found items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 space-y-2">
          <PackageSearch className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-700">No Items Found</h3>
          <p className="text-sm text-neutral-400">Try searching or clearing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const isFound = item.type === "Found";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-neutral-100 relative overflow-hidden">
                    <img
                      src={
                        item.image ||
                        (isFound
                          ? "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
                          : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60")
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
                          isFound
                            ? "bg-emerald-600 text-white"
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-neutral-800">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-neutral-900 text-lg line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="space-y-1.5 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Date: {item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDetailItem(item)}
                    className="flex-1 py-2 px-3 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-700"
                  >
                    View Status Timeline
                  </button>

                  {isFound && item.status !== "Returned" && item.status !== "Verified" && (
                    <button
                      onClick={() => setSelectedClaimItem(item)}
                      className="py-2 px-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                    >
                      Claim Ownership
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REPORT ITEM MODAL */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Report Lost or Found Item">
        <form onSubmit={handleCreateReport} className="space-y-4">
          <div className="flex bg-neutral-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setReportForm({ ...reportForm, type: "Lost" })}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                reportForm.type === "Lost" ? "bg-rose-600 text-white shadow-xs" : "text-neutral-600"
              }`}
            >
              Report Lost Item
            </button>
            <button
              type="button"
              onClick={() => setReportForm({ ...reportForm, type: "Found" })}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                reportForm.type === "Found" ? "bg-emerald-600 text-white shadow-xs" : "text-neutral-600"
              }`}
            >
              Report Found Item
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sony Wireless Headphones"
              value={reportForm.title}
              onChange={e => setReportForm({ ...reportForm, title: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
              <select
                value={reportForm.category}
                onChange={e => setReportForm({ ...reportForm, category: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
              >
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Date Misplaced / Found</label>
              <input
                type="date"
                value={reportForm.date}
                onChange={e => setReportForm({ ...reportForm, date: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Specific Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. Central Library 2nd Floor Quiet Zone"
              value={reportForm.location}
              onChange={e => setReportForm({ ...reportForm, location: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Mention identifying features, scratches, stickers, color, or contents."
              value={reportForm.description}
              onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal>

      {/* CLAIM OWNERSHIP MODAL */}
      {selectedClaimItem && (
        <Modal
          isOpen={!!selectedClaimItem}
          onClose={() => setSelectedClaimItem(null)}
          title={`Claim Ownership — ${selectedClaimItem.title}`}
        >
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
              <p className="font-semibold">Verification Notice</p>
              <p>Please describe non-visible identifying features (e.g. wallpapers, marks, serial numbers, case contents) to verify ownership.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={claimForm.studentName}
                  onChange={e => setClaimForm({ ...claimForm, studentName: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Roll No.</label>
                <input
                  type="text"
                  required
                  value={claimForm.studentId}
                  onChange={e => setClaimForm({ ...claimForm, studentId: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Contact Phone Number *</label>
              <input
                type="text"
                required
                value={claimForm.contactNumber}
                onChange={e => setClaimForm({ ...claimForm, contactNumber: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Proof of Ownership Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Explain exact proof..."
                value={claimForm.proofDescription}
                onChange={e => setClaimForm({ ...claimForm, proofDescription: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedClaimItem(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Submit Ownership Claim
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* TIMELINE MODAL */}
      {selectedDetailItem && (
        <Modal
          isOpen={!!selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          title={`Status Flow — ${selectedDetailItem.title}`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div>
                <span className="text-xs text-neutral-400 block">Current Status</span>
                <StatusBadge status={selectedDetailItem.status} />
              </div>
              <div>
                <span className="text-xs text-neutral-400 block">Type</span>
                <span className="text-sm font-bold text-neutral-800">{selectedDetailItem.type}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Status Flow Steps</h4>
              <div className="grid grid-cols-5 gap-1 text-center">
                {["Open", "Matched", "Claim Requested", "Verified", "Returned"].map((step, idx) => {
                  const statusOrder = ["Open", "Matched", "Claim Requested", "Verified", "Returned"];
                  const currentIdx = statusOrder.indexOf(selectedDetailItem.status);
                  const isDone = currentIdx >= idx;

                  return (
                    <div key={step} className="space-y-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isDone ? "bg-emerald-500" : "bg-neutral-200"
                        }`}
                      />
                      <span className={`text-[10px] font-semibold block ${isDone ? "text-emerald-700" : "text-neutral-400"}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
