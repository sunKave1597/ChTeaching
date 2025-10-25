const express = require('express');
const router = express.Router();
const qi = require('../controllers/quizImageController');

router.post('/upsert-one', qi.upsertOne);
router.get('/by-quiz/:quizId', qi.listByQuiz);
router.get('/:id/raw', qi.getRaw);
router.delete('/:id', qi.remove);
router.get('/by-question/:questionId', qi.getByQuestion);

module.exports = router;
