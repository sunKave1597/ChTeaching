const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const quizAttemptSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  quizId:  { type: Types.ObjectId, ref: 'Quiz', required: true, index: true },
  answers: {
    type: [Number], 
    default: [],
    validate: {
      validator: (v) => v.every(Number.isInteger),
      message: 'answers must be an array of integers'
    }
  },
  score: { type: Number, default: 0, min: 0 },
  passed: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
