import { useState, useEffect } from "react";
import { fetchLostFound, updateLostFoundStatus } from "../api";
import { Package, Check, X } from "lucide-react";

function AdminLostFound() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchLostFound().then(setItems);
  }, []);

  const handleUpdate = async (id, status) => {
    await updateLostFoundStatus(id, status);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Lost & Found Dashboard</h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">Manage open claims and mark items as returned/secured.</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="px-6 py-12 text-center text-neutral-500">No items reported.</div>
          ) : (
            items.map(item => (
              <div key={item.id} className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-neutral-50 transition-colors">
                 <div className="flex items-start gap-5 flex-1 p-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'Lost' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Package size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.type === 'Lost' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{item.type}</span>
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.status === 'Open' ? 'bg-neutral-100 text-neutral-600' : 'bg-green-100 text-green-700'}`}>{item.status}</span>
                      </div>
                      <h3 className="font-bold text-lg text-black tracking-tight mb-1">{item.title}</h3>
                      <p className="text-sm text-neutral-600 mb-1">{item.description}</p>
                      <span className="text-xs text-neutral-400 font-semibold">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 pr-4 sm:whitespace-nowrap flex-wrap shrink-0">
                    {item.status === 'Open' && (
                        <button onClick={() => handleUpdate(item.id, 'Claimed')} className="flex items-center gap-1.5 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl font-bold text-xs transition-colors">
                            <Check size={16} /> Mark Claimed / Secured
                        </button>
                    )}
                    {item.status === 'Claimed' && (
                        <button onClick={() => handleUpdate(item.id, 'Open')} className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 rounded-xl font-bold text-xs transition-colors">
                            <Check size={16} className="text-transparent" /> Re-open Case
                        </button>
                    )}
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLostFound;
