const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true }, 
  mode: { type: String, enum: ['pretest', 'game'], required: true },
  score: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });


module.exports = mongoose.model('QuizHistory', QuizHistorySchema);
