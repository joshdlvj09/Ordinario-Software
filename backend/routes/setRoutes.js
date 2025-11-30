const express = require('express')
const router = express.Router()
const {
  createSet,
  getExerciseHistory,
  getExercisePR,
} = require('../controllers/setController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createSet)
router.get('/exercise/:exerciseId', protect, getExerciseHistory)
router.get('/exercise/:exerciseId/pr', protect, getExercisePR)

module.exports = router
