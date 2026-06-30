const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/tours
router.get('/', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, duration, category, search, page = 1, limit = 9 } = req.query;
    const query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (duration) query.duration = { $lte: Number(duration) };

    const total = await Tour.countDocuments(query);
    const tours = await Tour.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, tours, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tours/featured
router.get('/featured', async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true }).limit(6);
    res.json({ success: true, tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tours/:id
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tours (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, tour });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/tours/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, tour });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/tours/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
