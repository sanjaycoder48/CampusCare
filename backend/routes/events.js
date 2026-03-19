const router = require('express').Router();
const { readDB, writeDB } = require('../data/database');
const crypto = require('crypto');

router.route('/').get((req, res) => {
  try {
    const db = readDB();
    const sorted = db.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(sorted);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post((req, res) => {
  try {
    const db = readDB();
    const newEvent = {
        id: crypto.randomUUID(),
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description,
        type: req.body.type || 'Other',
        rsvps: 0
    };
    db.events.push(newEvent);
    writeDB(db);
    res.json(newEvent);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/rsvp/:id').post((req, res) => {
  try {
    const db = readDB();
    const eventIndex = db.events.findIndex(e => e.id === req.params.id);
    if (eventIndex !== -1) {
      db.events[eventIndex].rsvps = (db.events[eventIndex].rsvps || 0) + 1;
      writeDB(db);
      res.json(db.events[eventIndex]);
    } else {
      res.status(404).json('Error: Event not found');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/delete/:id').delete((req, res) => {
    try {
      const db = readDB();
      db.events = db.events.filter(e => e.id !== req.params.id);
      writeDB(db);
      res.json('Event deleted.');
    } catch (err) {
      res.status(400).json('Error: ' + err);
    }
  });

module.exports = router;
