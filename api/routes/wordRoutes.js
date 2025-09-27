const express = require('express');
const {
  createWord,
  getWords,
  getWord,
  updateWord,
  deleteWord
} = require('../controllers/wordController');

const router = express.Router();

router.post('/', createWord);
router.get('/', getWords);
router.get('/:id', getWord);
router.put('/:id', updateWord);
router.delete('/:id', deleteWord);

module.exports = router;
