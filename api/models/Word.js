const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
  {
    chWord: { type: String, required: true },   
    pinYin: { type: String, required: true },   
    thWord: { type: String, required: true },   
    image: { type: String, default: null }      
  },
  { timestamps: true }
);

module.exports = mongoose.model('word', wordSchema);
