const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = (obj, allowed) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => allowed.includes(k)));

exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.validate();
    const created = await quiz.save();
    res.status(201).json(created);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message, details: err.errors });
    next(err);
  }
};

exports.getQuizzes = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.q) filter.title = new RegExp(escapeRegex(req.query.q), 'i');

    const [items, total] = await Promise.all([
      Quiz.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Quiz.countDocuments(filter),
    ]);

    res.json({ page, limit, total, pages: Math.ceil(total / limit) || 1, items });
  } catch (err) { next(err); }
};

exports.getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid quiz id' });

    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) { next(err); }
};

exports.updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid quiz id' });
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body must not be empty' });

    const allowed = ['title', 'questions'];
    const payload = pick(req.body, allowed);

    const updated = await Quiz.findByIdAndUpdate(
      id, payload, { new: true, runValidators: true, context: 'query' }
    ).lean();

    if (!updated) return res.status(404).json({ error: 'Quiz not found' });
    res.json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message, details: err.errors });
    next(err);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid quiz id' });

    const removed = await Quiz.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Quiz not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};
