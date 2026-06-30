const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

const auth = [protect, adminOnly];

// GET /api/admin/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [totalUsers, totalTours, totalBookings, recentBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Tour.countDocuments(),
      Booking.countDocuments(),
      Booking.find().populate('user', 'name email').populate('tour', 'title').sort({ createdAt: -1 }).limit(5)
    ]);
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTours,
        totalBookings,
        revenue: revenue[0]?.total || 0,
        recentBookings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tour', 'title location price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/bookings/:id
router.put('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('user', 'name email').populate('tour', 'title');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
