const mongoose = require('mongoose');

const STATUS = ['Confirmed', 'Cancelled'];

const bookingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: STATUS, default: 'Confirmed', required: true },
  },
  { timestamps: true },
);

bookingSchema.index({ car: 1, status: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
module.exports.STATUS = STATUS;
