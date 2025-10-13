const express = require('express');
const {
  createWord,
  getWords,
  getWord,
  updateWord,
  deleteWord
} = require('../controllers/wordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect , createWord);
router.get('/', protect, getWords);
router.get('/:id', protect, getWord);
router.put('/:id', protect, updateWord);
router.delete('/:id', deleteWord);

module.exports = router;
