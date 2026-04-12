const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { mockData } from './mockData';

// COMPLAINTS API
export const fetchComplaints = async () => {
  try {
    const res = await fetch(`${API_URL}/complaints`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error fetching complaints:', err);
    return mockData.complaints;
  }
};

export const createComplaint = async (data) => {
  try {
    const res = await fetch(`${API_URL}/complaints/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error creating complaint:', err);
    const newComplaint = { id: `comp_${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString(), ...data };
    mockData.complaints.unshift(newComplaint);
    return newComplaint;
  }
};

export const updateComplaintStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/complaints/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error updating complaint status:', err);
    const index = mockData.complaints.findIndex(c => c.id === id);
    if (index !== -1) mockData.complaints[index].status = status;
    return mockData.complaints[index];
  }
};

export const clearAllComplaints = async () => {
  try {
    await fetch(`${API_URL}/complaints/clear`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error clearing complaints:', err);
    mockData.complaints = [];
  }
};

// EMERGENCIES API
export const fetchEmergencies = async () => {
  try {
    const res = await fetch(`${API_URL}/emergencies`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error fetching emergencies:', err);
    return mockData.emergencies;
  }
};

export const createEmergency = async (data) => {
  try {
    const res = await fetch(`${API_URL}/emergencies/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error creating emergency:', err);
    const newEmergency = { id: `emerg_${Date.now()}`, status: 'Reported', time: new Date().toISOString(), ...data };
    mockData.emergencies.unshift(newEmergency);
    return newEmergency;
  }
};

export const updateEmergencyStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/emergencies/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error updating emergency status:', err);
    const index = mockData.emergencies.findIndex(e => e.id === id);
    if (index !== -1) mockData.emergencies[index].status = status;
    return mockData.emergencies[index];
  }
};

export const clearAllEmergencies = async () => {
  try {
    await fetch(`${API_URL}/emergencies/clear`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error clearing emergencies:', err);
    mockData.emergencies = [];
  }
};

// EVENTS API
export const fetchEvents = async () => {
  try {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error fetching events:', err);
    return mockData.events;
  }
};

export const createEvent = async (data) => {
  try {
    const res = await fetch(`${API_URL}/events/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error creating event:', err);
    const newEvent = { id: `event_${Date.now()}`, rsvps: 0, ...data };
    mockData.events.push(newEvent);
    return newEvent;
  }
};

export const rsvpEvent = async (id) => {
  try {
    const res = await fetch(`${API_URL}/events/rsvp/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error RSVPing to event:', err);
    const index = mockData.events.findIndex(e => e.id === id);
    if (index !== -1) mockData.events[index].rsvps += 1;
    return mockData.events[index];
  }
};

export const deleteEvent = async (id) => {
  try {
    await fetch(`${API_URL}/events/delete/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error deleting event:', err);
    mockData.events = mockData.events.filter(e => e.id !== id);
  }
};

// LOST & FOUND API
export const fetchLostFound = async () => {
  try {
    const res = await fetch(`${API_URL}/lostfound`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error fetching lost & found:', err);
    return mockData.lostFound;
  }
};

export const createLostFound = async (data) => {
  try {
    const res = await fetch(`${API_URL}/lostfound/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error creating lost/found item:', err);
    const newItem = { id: `lf_${Date.now()}`, status: 'Open', date: new Date().toISOString(), ...data };
    mockData.lostFound.unshift(newItem);
    return newItem;
  }
};

export const updateLostFoundStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/lostfound/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error updating lost/found status:', err);
    const index = mockData.lostFound.findIndex(l => l.id === id);
    if (index !== -1) mockData.lostFound[index].status = status;
    return mockData.lostFound[index];
  }
};

// FACILITIES API
export const fetchFacilities = async () => {
  try {
    const res = await fetch(`${API_URL}/facilities`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error fetching facilities:', err);
    return mockData.facilities;
  }
};

export const bookFacility = async (id, timeSlot) => {
  try {
    const res = await fetch(`${API_URL}/facilities/book/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeSlot })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error booking facility:', err);
    const fac = mockData.facilities.find(f => f.id === id);
    if (fac) {
      fac.bookings = fac.bookings || [];
      fac.bookings.push({ timeSlot, bookedBy: 'Demo User', date: new Date().toISOString() });
    }
    return fac;
  }
};

export const updateFacilityStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/facilities/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error updating facility status:', err);
    const fac = mockData.facilities.find(f => f.id === id);
    if (fac) fac.status = status;
    return fac;
  }
};

export const clearFacilityBookings = async (id) => {
  try {
    const res = await fetch(`${API_URL}/facilities/clear-bookings/${id}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error clearing facility bookings:', err);
    const fac = mockData.facilities.find(f => f.id === id);
    if (fac) fac.bookings = [];
    return fac;
  }
};

// CAFETERIA API
export const fetchCafeteria = async () => {
  try {
    const res = await fetch(`${API_URL}/cafeteria`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error fetching cafeteria:', err);
    return mockData.cafeteria;
  }
};

export const updateCafeteriaData = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/cafeteria/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Error updating cafeteria data:', err);
    const index = mockData.cafeteria.findIndex(c => c.id === id);
    if (index !== -1) {
      mockData.cafeteria[index] = { ...mockData.cafeteria[index], ...data };
      return mockData.cafeteria[index];
    }
    return null;
  }
};
