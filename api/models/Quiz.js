const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: v => Array.isArray(v) && v.length >= 2,
    required: true
  },
  answerIndex: { type: Number, required: true, min: 0 }
}, { _id: true });

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['pretest', 'game'], required: true }, 
  category: { type: String, trim: true },
  questions: { type: [QuestionSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
