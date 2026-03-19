import { useState, useEffect } from "react";
import { fetchEvents, rsvpEvent } from "../api";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";

function Events() {
  const [events, setEvents] = useState([]);
  const [rsvped, setRsvped] = useState(new Set());

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  const handleRsvp = async (id) => {
    if (rsvped.has(id)) return;
    const updated = await rsvpEvent(id);
    if (updated) {
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setRsvped((prev) => new Set([...prev, id]));
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Campus Events</h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">Discover and RSVP to upcoming activities, seminars, and fests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <p className="text-neutral-500 col-span-2 text-center py-10">No upcoming events are currently scheduled.</p>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{evt.type}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2 leading-tight">{evt.title}</h3>
              <p className="text-neutral-500 text-sm mb-5 line-clamp-2 leading-relaxed">{evt.description}</p>
              
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Calendar size={16} className="text-neutral-400" />
                  {new Date(evt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <MapPin size={16} className="text-neutral-400" />
                  {evt.location}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Users size={16} className="text-neutral-400" />
                  {evt.rsvps} Students Going
                </div>
              </div>

              <button
                onClick={() => handleRsvp(evt.id)}
                disabled={rsvped.has(evt.id)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  rsvped.has(evt.id)
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <Ticket size={18} />
                {rsvped.has(evt.id) ? 'RSVP Confirmed' : 'RSVP Now'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Events;
