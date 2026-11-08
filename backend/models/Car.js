const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  nickname: { type: String, required: true, trim: true },
  rego: { type: String, required: true, unique: true, trim: true, uppercase: true },
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  color: { type: String, required: true, trim: true },
  dailyRate: { type: Number, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  tags: {
    type: [
      {
        type: String,
        enum: ['small', 'medium', 'large', 'suv', 'van', 'ute', 'ev', 'hybrid', 'luxury', 'sports'],
      },
    ],
    default: [],
  },
  status: { type: String, enum: ['Active', 'Retired'], default: 'Active' },
});

module.exports = mongoose.model('Car', carSchema);
