const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/db.json');

// Initialize with some realistic seed complaints
const defaultData = {
  complaints: [
    {
      id: "comp_1",
      title: "Broken AC in Library Silent Zone",
      category: "Maintenance",
      description: "The air conditioning unit in the 2nd floor silent study zone is dripping water onto the desks and blowing hot air. Hard to concentrate.",
      status: "Under Review",
      photos: [],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "comp_2",
      title: "Campus Wi-Fi drops constantly near Block B",
      category: "Infrastructure",
      description: "The eduroam network keeps disconnecting every 5 minutes in Lecture Hall B3. Makes it impossible to follow online materials or take quizzes.",
      status: "In Progress",
      photos: [],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: "comp_3",
      title: "Clogged sink in Boys Hostel C",
      category: "Plumbing",
      description: "The leftmost washbasin on the 3rd floor washroom in Hostel C is completely clogged, overflowing, and smells terrible.",
      status: "Pending",
      photos: [],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "comp_4",
      title: "Gym Treadmill #3 broken",
      category: "Equipment",
      description: "The motor on treadmill #3 makes a loud grinding noise and stops suddenly. Needs immediate fixing as it's a hazard.",
      status: "Resolved",
      photos: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: "comp_5",
      title: "Mess food hygiene issue - Plastic wrapping",
      category: "Food & Dining",
      description: "Found plastic pieces in the gravy served at lunch today in the North Mess.",
      status: "Under Review",
      photos: [],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ],
  emergencies: [
    {
      id: "emerg_1",
      type: "Medical",
      location: "Football Ground",
      description: "Student collapsed due to heat exhaustion and requires an ambulance immediately.",
      status: "Resolved",
      time: new Date(Date.now() - 86400000 * 2).toISOString(),
      photos: [],
      reportedBy: "user"
    },
    {
      id: "emerg_2",
      type: "Security",
      location: "Main Gate Entry",
      description: "Tailgaters entered the campus without ID checks. They are carrying suspicious bags and heading towards the academic block.",
      status: "Reported",
      time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      photos: [],
      reportedBy: "user"
    },
    {
      id: "emerg_3",
      type: "Fire",
      location: "Chemistry Lab 2",
      description: "Chemical spill triggered a small fire. Fire alarm is ringing and smoke fills the hall.",
      status: "Reported",
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      photos: [],
      reportedBy: "admin"
    }
  ],
  events: [
    {
      id: "event_1",
      title: "HackCampus 2026",
      date: new Date(Date.now() + 86400000 * 5).toISOString(),
      location: "Main Auditorium",
      description: "36-hour hackathon focusing on AI and Web3 technologies. Great prizes to be won! Meet sponsors and collaborate.",
      type: "Academic",
      rsvps: 245
    },
    {
      id: "event_2",
      title: "Inter-College Sports Fest",
      date: new Date(Date.now() + 86400000 * 12).toISOString(),
      location: "Sports Ground & Indoor Complex",
      description: "A three-day sports extravaganza featuring athletics, football, and basketball tournaments with 10 visiting colleges.",
      type: "Sports",
      rsvps: 512
    },
    {
      id: "event_3",
      title: "Career Fair & Placement Drive",
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      location: "Placement Cell & Library Annex",
      description: "Meet recruiters from Google, Microsoft, Amazon, and top startups. Bring copies of your resume.",
      type: "Academic",
      rsvps: 890
    },
    {
      id: "event_4",
      title: "Photography Workshop by NatGeo",
      date: new Date(Date.now() + 86400000 * 8).toISOString(),
      location: "Lecture Hall D",
      description: "Learn wildlife and campus photography from professional photographers.",
      type: "Workshop",
      rsvps: 120
    }
  ],
  lostFound: [
    {
      id: "lf_1",
      title: "Lost Sony WH-1000XM4 Headphones",
      type: "Lost",
      category: "Electronics",
      description: "Black over-ear headphones missing since yesterday. Suspect left in Study Room A. They have a small scratch on the right cup.",
      status: "Open",
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "lf_2",
      title: "Found Mechanical Keyboard",
      type: "Found",
      category: "Electronics",
      description: "Found a Keychron K2 keyboard in the Computer Center Lab 3. Deposited at front desk. Claim with student ID.",
      status: "Open",
      date: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "lf_3",
      title: "Lost Student ID Card (John D.)",
      type: "Lost",
      category: "Document",
      description: "Lost my campus ID card somewhere near the main cafeteria. Need it to access hostel! Please contact if found.",
      status: "Claimed",
      date: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: "lf_4",
      title: "Found Blue Umbrella",
      type: "Found",
      category: "Miscellaneous",
      description: "Blue folding umbrella left behind on the campus bus route B. Kept at the campus transport office.",
      status: "Open",
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ],
  facilities: [
    {
      id: "fac_1",
      name: "Library Group Study Room 1",
      type: "Study Room",
      capacity: 6,
      status: "Available",
      bookings: []
    },
    {
      id: "fac_2",
      name: "Library Silent Pod",
      type: "Study Room",
      capacity: 1,
      status: "Booked",
      bookings: [
        { timeSlot: "10:00 - 12:00", bookedBy: "Alice H.", date: new Date().toISOString() }
      ]
    },
    {
      id: "fac_3",
      name: "Tech Auditorium",
      type: "Event Space",
      capacity: 350,
      status: "Available",
      bookings: [
        { timeSlot: "14:00 - 18:00", bookedBy: "GDSC Club", date: new Date().toISOString() }
      ]
    },
    {
      id: "fac_4",
      name: "Badminton Court 1",
      type: "Sports",
      capacity: 4,
      status: "Booked",
      bookings: [
        { timeSlot: "18:00 - 19:00", bookedBy: "John D.", date: new Date().toISOString() },
        { timeSlot: "19:00 - 20:00", bookedBy: "Mark S.", date: new Date().toISOString() }
      ]
    },
    {
      id: "fac_5",
      name: "Computer Center - AI Lab",
      type: "Laboratory",
      capacity: 30,
      status: "Maintenance",
      bookings: []
    }
  ],
  cafeteria: [
    {
      id: "cafe_1",
      name: "North Indian Mess",
      crowdStatus: "High",
      menu: {
        breakfast: "Aloo Paratha, Curd, Pickle, Tea/Coffee",
        lunch: "Rajma Chawal, Paneer Tikka Masala, Roti, Mixed Veg, Boondi Raita, Gulab Jamun",
        dinner: "Dal Makhani, Butter Naan, Kadai Paneer, Jeera Rice, Salad"
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: "cafe_2",
      name: "South Indian Mess",
      crowdStatus: "Medium",
      menu: {
        breakfast: "Masala Dosa, Idli, Medu Vada, Sambar, Coconut Chutney",
        lunch: "Rice, Rasam, Sambar, Cabbage Poriyal, Appalam, Semiys Payasam",
        dinner: "Uttapam, Lemon Rice, Coconut Chutney, Filter Coffee"
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: "cafe_3",
      name: "Night Canteen & Snacks",
      crowdStatus: "Low",
      menu: {
        breakfast: "Closed",
        lunch: "Grilled Sandwiches, Veg Burgers, French Fries, Cold Coffee",
        dinner: "Maggi Noodles, Bread Omelette, Paneer Kathi Roll, Milkshakes, Ice Cream"
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
