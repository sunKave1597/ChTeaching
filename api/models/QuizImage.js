// models/QuizImage.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizImageSchema = new Schema({
  quizId: { type: String, required: true, index: true },       
  questionId: { type: String, default: null, index: true },    
  kind: { type: String, enum: ['cover', 'question'], required: true },
  contentType: { type: String, required: true },
  base64Data: { type: String, required: true },                
  caption: { type: String, default: '' }
}, { timestamps: true });

QuizImageSchema.index({ quizId: 1, kind: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('QuizImage', QuizImageSchema);
