const express = require('express')
const router = express.Router()
const {
  addWeightEntry,
  getWeightHistory,
  getLatestWeight,
} = require('../controllers/weightController')
const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(protect, getWeightHistory)
  .post(protect, addWeightEntry)

router.get('/latest', protect, getLatestWeight)

module.exports = router
