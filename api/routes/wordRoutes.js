const express = require('express');
const {
  createWord,
  getWords,
  getWord,
  deleteWord,
  getRandomWordByCategory
} = require('../controllers/wordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createWord);  
router.get('/', getWords);    
router.get('/:id' , getWord); 
router.delete('/:id', protect, deleteWord);
router.get('/random/:category', getRandomWordByCategory);

module.exports = router;
