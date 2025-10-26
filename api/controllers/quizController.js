const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizImage = require('../models/QuizImage');

const isDataUrl = (s) => /^data:(image\/[a-z0-9.+-]+);base64,[A-Za-z0-9+/=]+$/i.test(s || '');

function normalizeImage({ base64Data, mimeType }) {
  if (!base64Data) throw new Error('base64Data is required');

  if (isDataUrl(base64Data)) {
    const m = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(base64Data);
    const contentType = m[1];
    const b64 = m[2];
    return {
      contentType,
      dataUrl: `data:${contentType};base64:${b64}`,
      size: Math.floor((b64.length * 3) / 4), 
    };
  }

  if (!mimeType) {
    throw new Error('mimeType required when base64Data is not a data URL');
  }
  const b64 = base64Data;
  return {
    contentType: mimeType,
    dataUrl: `data:${mimeType};base64,${b64}`,
    size: Math.floor((b64.length * 3) / 4),
  };
}
exports.insertOneQuestionJson = async (req, res, next) => {
  let session;
  try {
    const {
      type,
      category,
      text,
      options,
      answerIndex,
      base64Data,
      mimeType,
      caption = ''
    } = req.body || {};

    if (!['pretest', 'game'].includes(type))
      return res.status(400).json({ error: 'type must be pretest or game' });
    if (!category || !text)
      return res.status(400).json({ error: 'category and text are required' });
    if (!Array.isArray(options) || options.length < 2)
      return res.status(400).json({ error: 'options must have >= 2 items' });
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length)
      return res.status(400).json({ error: 'answerIndex out of range' });
    if (!base64Data)
      return res.status(400).json({ error: 'base64Data is required' });

    let normalized;
    try { normalized = normalizeImage({ base64Data, mimeType }); }
    catch (e) { return res.status(400).json({ error: e.message }); }

    try { session = await mongoose.startSession(); session.startTransaction(); } catch {}

    let quiz = await Quiz.findOne({ type, category }).sort({ createdAt: -1 });
    if (!quiz) {
      quiz = await Quiz.create([{ title: `${category} • ${type}`, type, category, questions: [] }], { session });
      quiz = quiz[0];
    }

    quiz.questions.push({ text, options, answerIndex });
    const newQuestion = quiz.questions[quiz.questions.length - 1];
    await quiz.save({ session });

    const imgDoc = await QuizImage.create([{
      quizId: String(quiz._id),
      questionId: String(newQuestion._id),
      kind: 'question',
      contentType: normalized.contentType,
      base64Data: normalized.dataUrl,   
      caption
    }], { session });

    if (session) await session.commitTransaction();
    if (session) session.endSession();

    res.status(201).json({
      quizId: String(quiz._id),
      question: {
        _id: String(newQuestion._id),
        text: newQuestion.text,
        options: newQuestion.options,
        answerIndex: newQuestion.answerIndex
      },
      image: {
        _id: String(imgDoc[0]._id),
        contentType: imgDoc[0].contentType,
        size: normalized.size,
        caption: imgDoc[0].caption
      }
    });
  } catch (err) {
    if (session) { try { await session.abortTransaction(); } catch {} finally { session.endSession(); } }
    next(err);
  }
};

exports.getRandomByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!['pretest', 'game'].includes(type)) {
      return res.status(400).json({ error: 'type must be pretest or game' });
    }

    const limit = type === 'pretest' ? 15 : 20;

    const quizzes = await Quiz.aggregate([
      { $match: { type } },
      { $unwind: '$questions' },
      { $sample: { size: limit } },
      {
        $project: {
          _id: 0,
          quizId: '$_id',
          type: 1,
          category: 1,
          questionId: '$questions._id',
          text: '$questions.text',
          options: '$questions.options',
          answerIndex: '$questions.answerIndex'
        }
      }
    ]);

    if (!quizzes.length) {
      return res.status(404).json({ error: `No quizzes found for type "${type}"` });
    }

    res.json({
      type,
      total: quizzes.length,
      limit,
      items: quizzes
    });
  } catch (err) {
    next(err);
  }
};

exports.getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid quiz id' });
    }

    const quiz = await Quiz.findById(id).lean();
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.json({
      _id: quiz._id,
      title: quiz.title,
      type: quiz.type,
      category: quiz.category,
      totalQuestions: quiz.questions?.length || 0,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        text: q.text,
        options: q.options,
        answerIndex: q.answerIndex
      }))
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteQuestionById = async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: 'Invalid quizId or questionId' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const beforeCount = quiz.questions.length;
    quiz.questions = quiz.questions.filter(q => String(q._id) !== String(questionId));

    if (quiz.questions.length === beforeCount) {
      return res.status(404).json({ error: 'Question not found in quiz' });
    }
    if (quiz.questions.length === 0) {
      await Quiz.findByIdAndDelete(quizId);
      return res.json({ message: 'Quiz deleted because it became empty' });
    }
    await quiz.save();
    res.json({ message: 'Question deleted successfully', remaining: quiz.questions.length });
  } catch (err) {
    next(err);
  }
};

exports.updateQuizById = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { title, category, type, questions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(quizId))
      return res.status(400).json({ error: 'Invalid quiz id' });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    if (title) quiz.title = title;
    if (category) quiz.category = category;
    if (type && ['pretest', 'game'].includes(type)) quiz.type = type;

    if (Array.isArray(questions) && questions.length > 0) {
      for (const q of questions) {
        if (q._id) {
          const idx = quiz.questions.findIndex(x => String(x._id) === String(q._id));
          if (idx >= 0) {
            if (q.text !== undefined) quiz.questions[idx].text = q.text;
            if (Array.isArray(q.options)) quiz.questions[idx].options = q.options;
            if (Number.isInteger(q.answerIndex)) quiz.questions[idx].answerIndex = q.answerIndex;
          }
        } else {
          if (q.text && Array.isArray(q.options) && Number.isInteger(q.answerIndex)) {
            quiz.questions.push({
              text: q.text,
              options: q.options,
              answerIndex: q.answerIndex
            });
          }
        }
      }
    }
    await quiz.save();
    res.json({
      message: 'Quiz updated successfully',
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        type: quiz.type,
        category: quiz.category,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          text: q.text,
          options: q.options,
          answerIndex: q.answerIndex
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllQuizzes  = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formatted = quizzes.map(qz => ({
      _id: qz._id,
      title: qz.title,
      type: qz.type,
      category: qz.category,
      createdAt: qz.createdAt,
      updatedAt: qz.updatedAt,
      totalQuestions: qz.questions?.length || 0,
      questions: (qz.questions || []).map(q => ({
        _id: q._id,
        text: q.text,
        options: q.options,
        answerIndex: q.answerIndex
      }))
    }));

    res.json({
      total: formatted.length,
      items: formatted
    });
  } catch (err) {
    next(err);
  }
};
