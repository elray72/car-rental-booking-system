const mongoose = require('mongoose');

const STATUS = ['Active', 'Retired'];
const TAGS = ['small', 'medium', 'large', 'suv', 'van', 'ute', 'ev', 'hybrid', 'luxury', 'sports'];

const carSchema = new mongoose.Schema({
  nickname: { type: String, required: true, trim: true },
  rego: { type: String, required: true, unique: true, trim: true, uppercase: true },
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  color: { type: String, required: true, trim: true },
  dailyRate: { type: Number, required: true, default: 0 },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  tags: {
    type: [
      {
        type: String,
        enum: TAGS,
      },
    ],
    default: [],
  },
  status: { type: String, enum: STATUS, default: 'Active' },
});

module.exports = mongoose.model('Car', carSchema);
module.exports.STATUS = STATUS;
module.exports.TAGS = TAGS;
