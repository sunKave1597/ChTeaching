const mongoose = require('mongoose');
const Word = require('../models/Word');
const WordImage = require('../models/wordImage');

exports.createWord = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { chWord, pinYin, thWord, category, image } = req.body;

    if (!image || !image.base64Data || !image.contentType) {
      return res.status(400).json({ message: "Image (base64Data + contentType) is required" });
    }

    await session.withTransaction(async () => {
      const [newWord] = await Word.create(
        [{ chWord, pinYin, thWord, category }],
        { session }
      );

      await WordImage.create(
        [{
          wordId: newWord._id,
          kind: image.kind || 'primary',
          contentType: image.contentType,
          base64Data: image.base64Data,
          caption: image.caption || ''
        }],
        { session }
      );

      const result = {
        ...newWord.toObject(),
        image: {
          contentType: image.contentType,
          caption: image.caption || '',
          dataUrl: `data:${image.contentType};base64,${image.base64Data}`
        }
      };

      res.status(201).json(result);
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find().select('-__v').sort({ createdAt: -1 });
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWord = async (req, res) => {
  try {
    const wordId = req.params.id;
    const word = await Word.findById(wordId).lean();
    if (!word) return res.status(404).json({ message: "Word not found" });

    const images = await WordImage.find({ wordId }).lean();
    const formatted = images.map(img => ({
      _id: img._id,
      kind: img.kind,
      caption: img.caption,
      contentType: img.contentType,
      dataUrl: `data:${img.contentType};base64,${img.base64Data}`,
    }));

    res.json({ ...word, images: formatted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWord = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const word = await Word.findByIdAndDelete(req.params.id, { session });
      if (!word) throw new Error('Word not found');
      await WordImage.deleteMany({ wordId: word._id }, { session });
    });

    res.json({ message: 'Word deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

exports.getRandomWordByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 1; 
    const randomWords = await Word.aggregate([
      { $match: { category } },
      { $sample: { size: limit } }
    ]);

    if (randomWords.length === 0) {
      return res.status(404).json({ message: `No words found in category: ${category}` });
    }
    const wordIds = randomWords.map(w => w._id);
    const images = await WordImage.find({ wordId: { $in: wordIds } }).lean();
    const result = randomWords.map(w => {
      const relatedImages = images
        .filter(img => img.wordId.toString() === w._id.toString())
        .map(img => ({
          kind: img.kind,
          caption: img.caption,
          dataUrl: `data:${img.contentType};base64,${img.base64Data}`
        }));

      return {
        ...w,
        images: relatedImages
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};