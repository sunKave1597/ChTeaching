const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/quizAttemptController');

router.post('/', protect, ctrl.submitAttempt);
router.get('/', protect, ctrl.getMyAttempts);
router.get('/:id', protect, ctrl.getAttemptById);

module.exports = router;
