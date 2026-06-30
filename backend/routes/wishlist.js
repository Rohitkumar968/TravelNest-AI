const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/auth');

// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('tours');
    if (!wishlist) wishlist = { tours: [] };
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/wishlist/toggle
router.post('/toggle', protect, async (req, res) => {
  try {
    const { tourId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, tours: [tourId] });
      return res.json({ success: true, added: true, wishlist });
    }

    const idx = wishlist.tours.indexOf(tourId);
    if (idx > -1) {
      wishlist.tours.splice(idx, 1);
      await wishlist.save();
      return res.json({ success: true, added: false, wishlist });
    } else {
      wishlist.tours.push(tourId);
      await wishlist.save();
      return res.json({ success: true, added: true, wishlist });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
