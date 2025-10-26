const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const QuizImage = require('../models/QuizImage');

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseDataURL = (dataURL) => {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataURL || '');
  if (!m) return null;
  const contentType = m[1];
  const buffer = Buffer.from(m[2], 'base64');
  return { contentType, buffer };
};

exports.upsertOne = async (req, res, next) => {
  try {
    const { quizId, kind, questionId, dataURL } = req.body;

    if (!isObjectId(quizId)) return res.status(400).json({ error: 'Invalid quizId' });
    if (!['cover', 'question'].includes(kind)) return res.status(400).json({ error: 'kind must be cover or question' });
    if (kind === 'question' && !isObjectId(questionId)) return res.status(400).json({ error: 'questionId required for question kind' });

    const parsed = parseDataURL(dataURL);
    if (!parsed) return res.status(400).json({ error: 'dataURL must be valid data:image/*;base64,...' });

    const quiz = await Quiz.findById(quizId).select('_id questions._id').lean();
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    if (kind === 'question') {
      const existsQ = (quiz.questions || []).some(q => String(q._id) === String(questionId));
      if (!existsQ) return res.status(400).json({ error: 'questionId not in quiz' });
    }

    const filter = { quizId, kind, questionId: kind === 'question' ? questionId : null };
    const update = {
      $set: {
        contentType: parsed.contentType,
        size: parsed.buffer.length,
        data: parsed.buffer
      }
    };
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };

    const doc = await QuizImage.findOneAndUpdate(filter, update, options).lean();
    const { _id, contentType, size } = doc;
    res.status(201).json({ _id, quizId, kind, questionId: doc.questionId, contentType, size });
  } catch (err) { next(err); }
};

exports.listByQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { questionId } = req.query;
    const includeData = (req.query.includeData || '').toLowerCase() === 'true';

    const filter = { quizId };
    if (questionId) filter.questionId = questionId; 

    const select =
      '_id quizId kind questionId caption contentType createdAt updatedAt' +
      (includeData ? ' base64Data' : '');

    const items = await QuizImage.find(filter).select(select).lean();

    res.json(items);
  } catch (err) { next(err); }
};

exports.getByQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const or = [{ questionId }];
    if (isObjectId(questionId)) {
      or.push({ questionId: new mongoose.Types.ObjectId(questionId) });
    }

    const select = '_id quizId kind questionId caption contentType base64Data createdAt updatedAt';

    const doc = await QuizImage.findOne({ $or: or }).select(select).lean();
    if (!doc) {
      return res.status(404).json({ error: 'Image for this questionId not found' });
    }

    res.json(doc);
  } catch (err) {
    next(err);
  }
};





exports.getRaw = async (req, res, next) => {
  try {
    const { id } = req.params;
    const img = await QuizImage.findById(id).lean();
    if (!img) return res.status(404).json({ error: 'Image not found' });

    const m = /^data:(.+);base64,(.+)$/i.exec(img.base64Data);
    const contentType = m ? m[1] : img.contentType;
    const b64 = m ? m[2] : '';
    const buf = Buffer.from(b64, 'base64');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buf.length);
    return res.end(buf);
  } catch (err) { next(err); }
};


exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const removed = await QuizImage.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Image not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};
