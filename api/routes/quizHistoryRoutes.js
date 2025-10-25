// routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const protech = require('../middleware/authMiddleware').protect;
const {
    recordHistory,
    getMyHistories,
    getAllHistories 
 } = require('../controllers/quizHistoryController');

router.post('/', protech ,recordHistory);
router.get('/me', protech, getMyHistories);
router.get('/', getAllHistories);

module.exports = router;
