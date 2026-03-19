const router = require('express').Router();
const { readDB } = require('../data/database');

// Get cafeteria data
router.route('/').get((req, res) => {
  try {
    const db = readDB();
    res.json(db.cafeteria || []);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
