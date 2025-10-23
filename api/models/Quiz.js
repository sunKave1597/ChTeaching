const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: {
      validator: (v) => Array.isArray(v) && v.length >= 2 && v.every(s => typeof s === 'string' && s.trim() !== ''),
      message: 'options must be an array of non-empty strings with at least 2 items'
    },
    required: true
  },
  answerIndex: {
    type: Number,
    required: true,
    validate: {
      validator: function(i){ return Number.isInteger(i) && i >= 0 && this.options && i < this.options.length; },
      message: 'answerIndex must be a valid integer index into options'
    }
  }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  questions: { type: [QuestionSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
