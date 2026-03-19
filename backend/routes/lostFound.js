const router = require('express').Router();
const { readDB, writeDB } = require('../data/database');
const crypto = require('crypto');

router.route('/').get((req, res) => {
  try {
    const db = readDB();
    const sorted = db.lostFound.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sorted);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post((req, res) => {
  try {
    const db = readDB();
    const newItem = {
        id: crypto.randomUUID(),
        title: req.body.title,
        type: req.body.type,
        category: req.body.category,
        description: req.body.description,
        status: 'Open',
        date: new Date().toISOString()
    };
    db.lostFound.push(newItem);
    writeDB(db);
    res.json(newItem);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/update/:id').post((req, res) => {
  try {
    const db = readDB();
    const index = db.lostFound.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
      if (req.body.status) db.lostFound[index].status = req.body.status;
      writeDB(db);
      res.json('Item updated!');
    } else {
      res.status(404).json('Error: Item not found');
    }
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
