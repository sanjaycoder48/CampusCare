const router = require('express').Router();
const { readDB, writeDB } = require('../data/database');
const crypto = require('crypto');

// Get all complaints
router.route('/').get((req, res) => {
  try {
    const db = readDB();
    const sorted = db.complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Create a new complaint
router.route('/add').post((req, res) => {
  try {
    const db = readDB();
    const newComplaint = {
      id: crypto.randomUUID(),
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      status: req.body.status || 'Pending',
      photos: req.body.photos || [],
      createdAt: new Date().toISOString()
    };
    db.complaints.push(newComplaint);
    writeDB(db);
    res.json(newComplaint);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update complaint status
router.route('/update/:id').post((req, res) => {
  try {
    const db = readDB();
    const complaintIndex = db.complaints.findIndex(c => c.id === req.params.id);
    if (complaintIndex !== -1) {
      if (req.body.status) db.complaints[complaintIndex].status = req.body.status;
      writeDB(db);
      res.json('Complaint updated!');
    } else {
      res.status(404).json('Error: Complaint not found');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete all complaints (for history clearing)
router.route('/clear').delete((req, res) => {
  try {
    const db = readDB();
    db.complaints = [];
    writeDB(db);
    res.json('Complaints cleared!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
