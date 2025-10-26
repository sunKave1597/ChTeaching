const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
  {
    chWord: { type: String, required: true },
    pinYin: { type: String, required: true },
    thWord: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Word', wordSchema);
