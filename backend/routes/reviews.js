const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// GET /api/reviews/:tourId
router.get('/:tourId', async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, tour: tourId });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed this tour' });

    const review = await Review.create({ user: req.user._id, tour: tourId, rating, comment });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
