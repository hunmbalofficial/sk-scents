const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    required: true,
  },
  topNotes: [String],
  middleNotes: [String],
  baseNotes: [String],
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  images: [String],
  bestSeller: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
