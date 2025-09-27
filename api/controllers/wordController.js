const Word = require('../models/Word');

exports.createWord = async (req, res) => {
  try {
    const { chWord, pinYin, thWord, image } = req.body;
    const word = await Word.create({ chWord, pinYin, thWord, image });
    res.status(201).json(word);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find();
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWord = async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) return res.status(404).json({ message: "Word not found" });
    res.json(word);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateWord = async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!word) return res.status(404).json({ message: "Word not found" });
    res.json(word);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);
    if (!word) return res.status(404).json({ message: "Word not found" });
    res.json({ message: "Word deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
