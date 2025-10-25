const QuizHistory = require('../models/QuizHistory');

exports.recordHistory = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authorized' });

    const { mode, score } = req.body;

    if (!['pretest', 'game'].includes(mode))
      return res.status(400).json({ error: 'mode must be pretest or game' });

    if (typeof score !== 'number' || score < 0)
      return res.status(400).json({ error: 'score must be a number >= 0' });

    const history = await QuizHistory.create({
      userId: req.user._id,  // ✅ เก็บ id ของผู้เล่น
      mode,
      score,
      playedAt: new Date()
    });

    res.status(201).json({
      message: 'History saved successfully',
      history
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyHistories = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authorized' });

    const histories = await QuizHistory.find({ userId: req.user._id })
      .sort({ playedAt: -1 })
      .lean();

    res.json(histories);
  } catch (err) {
    next(err);
  }
};

exports.getAllHistories = async (req, res, next) => {
  try {
    const histories = await QuizHistory.find().sort({ playedAt: -1 }).lean();
    res.json(histories);
  } catch (err) {
    next(err);
  }
};
