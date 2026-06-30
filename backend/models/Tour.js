const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tour title is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  country: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    type: String
  }],
  highlights: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  included: [String],
  excluded: [String],
  maxGroupSize: {
    type: Number,
    default: 20
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'moderate'
  },
  category: {
    type: String,
    enum: ['adventure', 'cultural', 'beach', 'mountain', 'city', 'wildlife', 'religious'],
    default: 'cultural'
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tour', tourSchema);
