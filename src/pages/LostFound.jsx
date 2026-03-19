import { useState, useEffect } from "react";
import { fetchLostFound, createLostFound } from "../api";
import { Search, Plus, MapPin, Package, Check } from "lucide-react";

function LostFound() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Lost", category: "Electronics", description: "" });

  useEffect(() => {
    fetchLostFound().then(setItems);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = await createLostFound(form);
    if (newItem) setItems([newItem, ...items]);
    setShowForm(false);
    setForm({ title: "", type: "Lost", category: "Electronics", description: "" });
  };

  const filteredItems = filter === "All" ? items : items.filter(i => i.type === filter);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Lost & Found</h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">Report lost items or help return found items to their owners.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-all shrink-0"
        >
          <Plus size={20} />
          {showForm ? 'Cancel Report' : 'Report Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-bold text-lg mb-4">New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Item Name (e.g. Blue Backpack)" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
              <option value="Lost">I Lost This Item</option>
              <option value="Found">I Found This Item</option>
            </select>
          </div>
          <div className="mb-4">
             <textarea placeholder="Describe where it was lost/found, specific colors, brands, etc." required rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm resize-none"></textarea>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors text-sm">Submit Report</button>
        </form>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Lost", "Found"].map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${filter === t ? 'bg-black text-white' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'}`}>
            {t} Items
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.length === 0 ? (
          <p className="text-neutral-500 py-6">No items reported.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white border border-neutral-200 p-6 rounded-2xl flex gap-5 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'Lost' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                 <Package size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.type === 'Lost' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{item.type}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.status === 'Open' ? 'bg-neutral-100 text-neutral-600' : 'bg-green-100 text-green-700'}`}>{item.status}</span>
                </div>
                <h3 className="font-bold text-lg text-black tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{item.description}</p>
                <p className="text-xs text-neutral-400 font-semibold">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LostFound;
