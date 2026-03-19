const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/db.json');

// Initialize with some realistic seed complaints
const defaultData = {
  complaints: [
    {
      id: "comp_1",
      title: "Broken AC in Library 2nd Floor",
      category: "Maintenance",
      description: "The air conditioning unit in the silent study zone has been blowing hot air since yesterday morning. It's making it impossible to study during the heatwave.",
      status: "Under Review",
      photos: [],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "comp_2",
      title: "Faulty Projector in Lecture Hall C",
      category: "Infrastructure",
      description: "The HDMI cable for the ceiling projector is completely severed, and the color is distorted on the VGA port.",
      status: "Pending",
      photos: [],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "comp_3",
      title: "No hot water in Dorm Block A",
      category: "Maintenance",
      description: "There hasn't been any hot water in the showers on the 3rd floor for three days.",
      status: "In Progress",
      photos: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: "comp_4",
      title: "Flickering lights in parking lot",
      category: "Safety",
      description: "Several street lights in the north parking structure are completely out or flickering, making it unsafe at night.",
      status: "Resolved",
      photos: [],
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ],
  emergencies: [
    {
      id: "emerg_1",
      type: "Medical",
      location: "Gymnasium",
      description: "Student injured their ankle severely during basketball game, requires immediate medical support.",
      status: "Resolved",
      time: new Date(Date.now() - 86400000 * 2).toISOString(),
      photos: [],
      reportedBy: "user"
    },
    {
      id: "emerg_2",
      type: "Security",
      location: "South Entrance",
      description: "Suspicious individual loitering around the bike racks with tools.",
      status: "Reported",
      time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      photos: [],
      reportedBy: "user"
    }
  ],
  events: [
    {
      id: "event_1",
      title: "Annual Tech Symposium 2026",
      date: new Date(Date.now() + 86400000 * 5).toISOString(),
      location: "Main Auditorium",
      description: "Join us for 2 days of robotics, coding challenges, and tech talks from industry leaders.",
      type: "Academic",
      rsvps: 142
    },
    {
      id: "event_2",
      title: "Inter-College Basketball Finals",
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      location: "Indoor Sports Complex",
      description: "Cheer for our team as they face off against the rival college in the grand finals!",
      type: "Sports",
      rsvps: 310
    }
  ],
  lostFound: [
    {
      id: "lf_1",
      title: "Lost AirPods Pro",
      type: "Lost",
      category: "Electronics",
      description: "I lost my AirPods case with the right earbud inside near the Science Block cafe.",
      status: "Open",
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "lf_2",
      title: "Found Calculator",
      type: "Found",
      category: "Academic",
      description: "Found a Casio scientific calculator in Lecture Hall B. Handed over to security desk.",
      status: "Claimed",
      date: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  facilities: [
    {
      id: "fac_1",
      name: "Library Study Room A",
      type: "Study Room",
      capacity: 4,
      status: "Available",
      bookings: []
    },
    {
      id: "fac_2",
      name: "Main Auditorium",
      type: "Event Space",
      capacity: 500,
      status: "Booked",
      bookings: [
        { timeSlot: "14:00 - 16:00", bookedBy: "Tech Club", date: new Date().toISOString() }
      ]
    },
    {
      id: "fac_3",
      name: "Indoor Basketball Court",
      type: "Sports",
      capacity: 20,
      status: "Available",
      bookings: []
    }
  ],
  cafeteria: [
    {
      id: "cafe_1",
      name: "Main Block Mess",
      crowdStatus: "High",
      menu: {
        breakfast: "Pancakes, Eggs, Oatmeal, Fresh Juice",
        lunch: "Grilled Chicken, Rice, Steamed Veggies, Pasta",
        dinner: "Pizza, Soup, Salad Bar, Dessert"
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: "cafe_2",
      name: "Science Block Cafe",
      crowdStatus: "Low",
      menu: {
        breakfast: "Muffins, Coffee, Breakfast Sandwiches",
        lunch: "Sandwiches, Wraps, Iced Tea",
        dinner: "Closed"
      },
      updatedAt: new Date().toISOString()
    }
  ]
};

function readDB() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
