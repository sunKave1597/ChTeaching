const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/quizController');

router.post('/', protect, ctrl.createQuiz);
router.get('/',  ctrl.getQuizzes);
router.get('/:id', protect, ctrl.getQuizById);
router.patch('/:id', protect, ctrl.updateQuiz);
router.delete('/:id', protect, ctrl.deleteQuiz);

module.exports = router;
