import { useState, useEffect } from "react";
import { fetchEvents, createEvent, deleteEvent } from "../api";
import { Calendar, Users, Trash2, Plus, MapPin } from "lucide-react";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Academic", location: "", date: "", description: "" });

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = await createEvent(form);
    if (newEvent) setEvents([...events, newEvent].sort((a,b) => new Date(a.date) - new Date(b.date)));
    setShowForm(false);
    setForm({ title: "", type: "Academic", location: "", date: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this event?")) {
      await deleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Manage Events</h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-2">Create and manage complete campus activities.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-all shrink-0"
        >
          <Plus size={20} />
          {showForm ? 'Cancel Creation' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-bold text-lg mb-4">New Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Event Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
              <option value="Academic">Academic / Seminar</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural Fest</option>
              <option value="Other">Other</option>
            </select>
            <input type="datetime-local" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
            <input type="text" placeholder="Location" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
          </div>
          <div className="mb-4">
             <textarea placeholder="Event Description..." required rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm resize-none"></textarea>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors text-sm">Publish Event</button>
        </form>
      )}

      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-neutral-100">
          {events.length === 0 ? (
            <div className="px-6 py-12 text-center text-neutral-500">No events currently scheduled.</div>
          ) : (
            events.map(evt => (
              <div key={evt.id} className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:bg-neutral-50 transition-colors">
                 <div className="flex items-start gap-5 flex-1 p-2">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-black tracking-tight mb-1">{evt.title}</h3>
                      <div className="flex gap-4 text-sm text-neutral-500 font-medium flex-wrap">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(evt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {evt.location}</span>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6 pr-4">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-black">{evt.rsvps}</span>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5"><Users size={12}/> RSVPs</span>
                    </div>
                    <button onClick={() => handleDelete(evt.id)} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex flex-col items-center justify-center hover:bg-rose-100 transition-colors shrink-0">
                        <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;
