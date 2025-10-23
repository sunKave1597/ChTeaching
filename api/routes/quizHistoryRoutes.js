const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/quizHistoryController');

router.post('/', protect, ctrl.recordHistory);
router.get('/', protect, ctrl.getMyHistories);
router.get('/all', protect, ctrl.getAllHistories);
router.get('/:id', protect, ctrl.getHistoryById);

module.exports = router;
