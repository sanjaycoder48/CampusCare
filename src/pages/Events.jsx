import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  User,
  Search,
  Users,
  Award,
  Sparkles,
  Filter
} from "lucide-react";
import {
  fetchEvents,
  registerEvent,
  cancelEventRegistration,
  fetchClubs,
  joinClub
} from "../api.js";
import Toast from "../components/Toast.jsx";
import Modal from "../components/Modal.jsx";

const DEPARTMENTS = [
  "All",
  "CSE",
  "IT",
  "AI&DS",
  "AIML",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil"
];

const CATEGORIES = ["All", "Academic", "Technical", "Sports", "Cultural", "Workshop"];

export default function Events() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTimeFilter, setEventTimeFilter] = useState("upcoming");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [certificateModalEvent, setCertificateModalEvent] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);

  const [toast, setToast] = useState(null);
  const userEmail = "student1@campuscare.edu";

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchEvents(), fetchClubs()]).then(([eventsData, clubsData]) => {
      if (isMounted) {
        setEvents(eventsData || []);
        setClubs(clubsData || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRegister = async (eventId) => {
    const updated = await registerEvent(eventId, userEmail);
    if (updated) {
      setEvents(events.map(e => (e.id === eventId ? updated : e)));
      if (selectedEvent?.id === eventId) setSelectedEvent(updated);
      showToast("success", "Successfully registered for the event!");
    }
  };

  const handleCancelRegistration = async (eventId) => {
    const updated = await cancelEventRegistration(eventId, userEmail);
    if (updated) {
      setEvents(events.map(e => (e.id === eventId ? updated : e)));
      if (selectedEvent?.id === eventId) setSelectedEvent(updated);
      showToast("info", "Registration canceled.");
    }
  };

  const handleJoinClub = async (clubId) => {
    const updated = await joinClub(clubId, userEmail);
    if (updated) {
      setClubs(clubs.map(c => (c.id === clubId ? updated : c)));
      if (selectedClub?.id === clubId) setSelectedClub(updated);
      showToast("success", "Joined club successfully!");
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesDept = selectedDept === "All" || event.department === selectedDept;
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch =
      (event.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const isEventPast = new Date(event.date) < new Date(new Date().setHours(0,0,0,0));
    const matchesTime =
      eventTimeFilter === "all" ||
      (eventTimeFilter === "upcoming" && !isEventPast) ||
      (eventTimeFilter === "past" && isEventPast);

    return matchesDept && matchesCategory && matchesSearch && matchesTime;
  });

  const filteredClubs = clubs.filter(club => {
    const matchesDept = selectedDept === "All" || club.department === selectedDept;
    const matchesSearch =
      (club.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            Events & Clubs Hub
          </h1>
          <p className="text-neutral-500 mt-1">
            Explore department events, register for upcoming activities, and join student clubs.
          </p>
        </div>

        <div className="flex bg-neutral-100 p-1.5 rounded-xl self-start md:self-auto border border-neutral-200">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "events"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Campus Events
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "clubs"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Department Clubs
          </button>
        </div>
      </div>

      {/* Department Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Department:
        </span>
        {DEPARTMENTS.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDept === dept
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Search & Category Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder={activeTab === "events" ? "Search events..." : "Search clubs..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
          />
        </div>

        {activeTab === "events" && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex bg-neutral-100 p-1 rounded-xl">
              <button
                onClick={() => setEventTimeFilter("upcoming")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  eventTimeFilter === "upcoming" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setEventTimeFilter("past")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  eventTimeFilter === "past" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                }`}
              >
                Past Events
              </button>
              <button
                onClick={() => setEventTimeFilter("all")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  eventTimeFilter === "all" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                }`}
              >
                All
              </button>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400">Loading events...</div>
      ) : activeTab === "events" ? (
        filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 space-y-3">
            <Calendar className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-semibold text-neutral-700">No Events Found</h3>
            <p className="text-sm text-neutral-400">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const isRegistered = (event.registrations || []).includes(userEmail);
              const isPast = new Date(event.date) < new Date(new Date().setHours(0,0,0,0));
              const isFull = (event.registeredCount || 0) >= (event.maxParticipants || 100);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="h-44 bg-neutral-100 relative overflow-hidden">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-neutral-800 shadow-xs">
                        {event.department || "General"}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 backdrop-blur-md text-white shadow-xs">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-neutral-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{event.date} at {event.time || "10:00 AM"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Users className="w-3.5 h-3.5" />
                          {event.registeredCount || 0} / {event.maxParticipants || 100} Registered
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1 py-2 px-3 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-700 transition-colors text-center"
                      >
                        Details
                      </button>

                      {isPast ? (
                        isRegistered ? (
                          <button
                            onClick={() => setCertificateModalEvent(event)}
                            className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5" /> Certificate
                          </button>
                        ) : (
                          <span className="px-3 py-2 text-xs font-medium text-neutral-400 bg-neutral-100 rounded-xl text-center flex-1">
                            Event Ended
                          </span>
                        )
                      ) : isRegistered ? (
                        <button
                          onClick={() => handleCancelRegistration(event.id)}
                          className="flex-1 py-2 px-3 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl transition-colors text-center"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(event.id)}
                          disabled={isFull}
                          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-colors text-center ${
                            isFull
                              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                          }`}
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => {
            const isJoined = (club.members || []).includes(userEmail);

            return (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {club.department} Dept
                    </span>
                    <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      {club.membersCount || (club.members || []).length} Members
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900">{club.name}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                    {club.description}
                  </p>

                  <div className="text-xs text-neutral-500 pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Coordinator: <strong className="text-neutral-700">{club.coordinator}</strong></span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="flex-1 py-2 px-3 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-700 transition-colors"
                  >
                    Announcements ({club.announcements?.length || 0})
                  </button>
                  {isJoined ? (
                    <span className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                      Joined
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinClub(club.id)}
                      className="py-2 px-4 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                    >
                      Join Club
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="space-y-6">
            <div className="h-56 bg-neutral-100 rounded-xl overflow-hidden relative">
              <img
                src={selectedEvent.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">{selectedEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-neutral-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-neutral-400 block mb-0.5">Date & Time</span>
                <span className="font-semibold text-neutral-800">{selectedEvent.date} at {selectedEvent.time || "10:00 AM"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">Venue</span>
                <span className="font-semibold text-neutral-800">{selectedEvent.venue}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">Coordinator</span>
                <span className="font-semibold text-neutral-800">{selectedEvent.coordinator}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CLUB ANNOUNCEMENTS MODAL */}
      {selectedClub && (
        <Modal
          isOpen={!!selectedClub}
          onClose={() => setSelectedClub(null)}
          title={`${selectedClub.name} — Announcements`}
        >
          <div className="space-y-4">
            {(selectedClub.announcements || []).length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No announcements published yet.</p>
            ) : (
              selectedClub.announcements.map(ann => (
                <div key={ann.id} className="p-3 bg-white border border-neutral-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-sm text-neutral-900">{ann.title}</h5>
                    <span className="text-[10px] text-neutral-400">{ann.date}</span>
                  </div>
                  <p className="text-xs text-neutral-600">{ann.content}</p>
                </div>
              ))
            )}
            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedClub(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CERTIFICATE MODAL */}
      {certificateModalEvent && (
        <Modal
          isOpen={!!certificateModalEvent}
          onClose={() => setCertificateModalEvent(null)}
          title="Official Certificate of Completion"
        >
          <div className="p-6 bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/50 border-4 border-double border-amber-300 rounded-2xl text-center space-y-4">
            <Award className="w-16 h-16 text-amber-500 mx-auto" />
            <h2 className="text-xl font-serif font-bold text-neutral-900 tracking-wide uppercase">Certificate of Participation</h2>
            <p className="text-xs text-neutral-600">This certifies that <strong className="text-indigo-700">{userEmail}</strong> participated in</p>
            <p className="text-sm font-bold text-neutral-900">{certificateModalEvent.title}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
