const express = require('express')
const router = express.Router()
const {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} = require('../controllers/exerciseController')
const { protect } = require('../middleware/authMiddleware')

router
  .route('/')
  .get(protect, getExercises)
  .post(protect, createExercise)

router
  .route('/:id')
  .put(protect, updateExercise)
  .delete(protect, deleteExercise)

module.exports = router
