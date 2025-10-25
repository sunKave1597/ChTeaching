// routes/quizInsertOneRoute.js
const express = require('express');
const router = express.Router();
const {
  insertOneQuestionJson,
  getRandomByType,
  getQuizById,
  deleteQuestionById,
  updateQuizById,
  getAllQuizzes
} = require('../controllers/quizController');


router.post('/insert-quiz', insertOneQuestionJson); 
router.get('/random/:type', getRandomByType);
router.get('/:id', getQuizById);
router.delete('/:quizId/questions/:questionId', deleteQuestionById);
router.patch('/:quizId', updateQuizById);
router.get('/', getAllQuizzes);

module.exports = router;
