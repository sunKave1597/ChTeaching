const mongoose = require('mongoose');

const historyQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  answerIndex: Number,
  userAnswer: Number
}, { _id: false });

const quizHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  mode: { type: String, enum: ['pretest', 'game'], required: true },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  questions: [historyQuestionSchema],
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizHistory', quizHistorySchema);
