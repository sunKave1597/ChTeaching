const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

exports.submitAttempt = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(quizId))
      return res.status(400).json({ error: 'Invalid quiz id' });
    if (!Array.isArray(answers) || !answers.every(Number.isInteger))
      return res.status(400).json({ error: 'answers must be an array of integers' });

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (answers.length !== quiz.questions.length)
      return res.status(400).json({ error: 'answers length must equal number of questions' });

    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === quiz.questions[i].answerIndex) score++;
    }
    const passed = score === quiz.questions.length;

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      quizId,
      answers,
      score,
      passed,
      submittedAt: new Date()
    });

    res.status(201).json(attempt);
  } catch (err) { next(err); }
};

exports.getMyAttempts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    if (req.query.quizId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.quizId))
        return res.status(400).json({ error: 'Invalid quiz id' });
      filter.quizId = req.query.quizId;
    }

    const [items, total] = await Promise.all([
      QuizAttempt.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      QuizAttempt.countDocuments(filter),
    ]);

    res.json({ page, limit, total, pages: Math.ceil(total / limit) || 1, items });
  } catch (err) { next(err); }
};

exports.getAttemptById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: 'Invalid attempt id' });

    const attempt = await QuizAttempt.findById(id).lean();
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    if (String(attempt.userId) !== String(req.user._id))
      return res.status(403).json({ error: 'Forbidden' });

    res.json(attempt);
  } catch (err) { next(err); }
};
