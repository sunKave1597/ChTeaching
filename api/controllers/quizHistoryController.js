const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizHistory = require('../models/QuizHistory');

exports.recordHistory = async (req, res, next) => {
  try {
    const { quizId, answers, mode } = req.body;

    if (!['pretest', 'game'].includes(mode))
      return res.status(400).json({ error: 'mode must be pretest or game' });
    if (!mongoose.Types.ObjectId.isValid(quizId))
      return res.status(400).json({ error: 'Invalid quizId' });
    if (!Array.isArray(answers))
      return res.status(400).json({ error: 'answers must be array' });

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const total = quiz.questions.length;
    let score = 0;

    const questionSnapshots = quiz.questions.map((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.answerIndex;
      if (isCorrect) score++;
      return {
        text: q.text,
        options: q.options,
        answerIndex: q.answerIndex,
        userAnswer
      };
    });

    const passed = score === total;

    const history = await QuizHistory.create({
      userId: req.user._id,
      quizId,
      mode,
      score,
      total,
      passed,
      questions: questionSnapshots
    });

    res.status(201).json(history);
  } catch (err) {
    next(err);
  }
};

exports.getMyHistories = async (req, res, next) => {
  try {
    const { mode, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };
    if (mode) filter.mode = mode;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      QuizHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      QuizHistory.countDocuments(filter)
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    next(err);
  }
};

exports.getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: 'Invalid history id' });

    const history = await QuizHistory.findById(id).lean();
    if (!history) return res.status(404).json({ error: 'History not found' });
    if (String(history.userId) !== String(req.user._id))
      return res.status(403).json({ error: 'Forbidden' });

    res.json(history);
  } catch (err) {
    next(err);
  }
};

exports.getAllHistories = async (req, res, next) => {
  try {
    const { mode, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (mode) filter.mode = mode;

    const [items, total] = await Promise.all([
      QuizHistory.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'users',               
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            mode: 1,
            score: 1,
            total: 1,
            passed: 1,
            playedAt: 1,
            createdAt: 1,
            'user._id': 1,
            'user.name': 1,
            'user.email': 1
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) }
      ]),
      QuizHistory.countDocuments(filter)
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    next(err);
  }
};

