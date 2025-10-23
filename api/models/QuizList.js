const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const quizListSchema = new Schema({
  quizId: { type: Types.ObjectId, ref: 'Quiz', required: true, index: true },
  question: { type: String, required: true, trim: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length >= 2 && v.every(s => typeof s === 'string' && s.trim() !== '')
    }
  },
  answerIndex: {
    type: Number,
    required: true,
    validate: {
      validator: function(i){ return Number.isInteger(i) && i >= 0 && this.options && i < this.options.length; }
    }
  },
  date: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('QuizList', quizListSchema);
