const API_URL = 'http://localhost:5000/api';

// COMPLAINTS API
export const fetchComplaints = async () => {
  try {
    const res = await fetch(`${API_URL}/complaints`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching complaints:', err);
    return [];
  }
};

export const createComplaint = async (data) => {
  try {
    const res = await fetch(`${API_URL}/complaints/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creating complaint:', err);
    return null;
  }
};

export const updateComplaintStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/complaints/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error updating complaint status:', err);
  }
};

export const clearAllComplaints = async () => {
  try {
    await fetch(`${API_URL}/complaints/clear`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error clearing complaints:', err);
  }
};

// EMERGENCIES API
export const fetchEmergencies = async () => {
  try {
    const res = await fetch(`${API_URL}/emergencies`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching emergencies:', err);
    return [];
  }
};

export const createEmergency = async (data) => {
  try {
    const res = await fetch(`${API_URL}/emergencies/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creating emergency:', err);
    return null;
  }
};

export const updateEmergencyStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/emergencies/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error updating emergency status:', err);
  }
};

export const clearAllEmergencies = async () => {
  try {
    await fetch(`${API_URL}/emergencies/clear`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error clearing emergencies:', err);
  }
};

// EVENTS API
export const fetchEvents = async () => {
  try {
    const res = await fetch(`${API_URL}/events`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
};

export const createEvent = async (data) => {
  try {
    const res = await fetch(`${API_URL}/events/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creating event:', err);
    return null;
  }
};

export const rsvpEvent = async (id) => {
  try {
    const res = await fetch(`${API_URL}/events/rsvp/${id}`, { method: 'POST' });
    return await res.json();
  } catch (err) {
    console.error('Error RSVPing to event:', err);
  }
};

export const deleteEvent = async (id) => {
  try {
    await fetch(`${API_URL}/events/delete/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error deleting event:', err);
  }
};

// LOST & FOUND API
export const fetchLostFound = async () => {
  try {
    const res = await fetch(`${API_URL}/lostfound`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching lost & found:', err);
    return [];
  }
};

export const createLostFound = async (data) => {
  try {
    const res = await fetch(`${API_URL}/lostfound/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Error creating lost/found item:', err);
    return null;
  }
};

export const updateLostFoundStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/lostfound/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    console.error('Error updating lost/found status:', err);
  }
};

// FACILITIES API
export const fetchFacilities = async () => {
  try {
    const res = await fetch(`${API_URL}/facilities`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching facilities:', err);
    return [];
  }
};

export const bookFacility = async (id, timeSlot) => {
  try {
    const res = await fetch(`${API_URL}/facilities/book/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeSlot })
    });
    return await res.json();
  } catch (err) {
    console.error('Error booking facility:', err);
    return null;
  }
};

export const updateFacilityStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_URL}/facilities/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (err) {
    console.error('Error updating facility status:', err);
    return null;
  }
};

export const clearFacilityBookings = async (id) => {
  try {
    const res = await fetch(`${API_URL}/facilities/clear-bookings/${id}`, {
      method: 'POST'
    });
    return await res.json();
  } catch (err) {
    console.error('Error clearing facility bookings:', err);
    return null;
  }
};

// CAFETERIA API
export const fetchCafeteria = async () => {
  try {
    const res = await fetch(`${API_URL}/cafeteria`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching cafeteria:', err);
    return [];
  }
};

export const updateCafeteriaData = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/cafeteria/update/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error('Error updating cafeteria data:', err);
    return null;
  }
};
