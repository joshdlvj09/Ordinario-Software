const asyncHandler = require('express-async-handler')
const Set = require('../models/setModel')

// @desc    Registrar un set
// @route   POST /api/sets
// @access  Private
const createSet = asyncHandler(async (req, res) => {
  const { exercise_id, rutina_id, date, reps, weight, rpe } = req.body

  if (!exercise_id || !reps || !weight) {
    res.status(400)
    throw new Error('exercise_id, reps y weight son obligatorios')
  }

  const set = await Set.create({
    user_id: req.user.id,
    exercise_id,
    rutina_id,
    date,
    reps,
    weight,
    rpe,
  })

  res.status(201).json(set)
})

// @desc    Historial de un ejercicio
// @route   GET /api/sets/exercise/:exerciseId
// @access  Private
const getExerciseHistory = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId

  const sets = await Set.find({
    user_id: req.user.id,
    exercise_id: exerciseId,
  }).sort({ date: -1 })

  res.status(200).json(sets)
})

// @desc    PR (peso máximo) de un ejercicio
// @route   GET /api/sets/exercise/:exerciseId/pr
// @access  Private
const getExercisePR = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId

  const bestSet = await Set.findOne({
    user_id: req.user.id,
    exercise_id: exerciseId,
  })
    .sort({ weight: -1, reps: -1 })
    .exec()

  if (!bestSet) {
    res.status(404)
    throw new Error('No hay sets registrados para este ejercicio')
  }

  res.status(200).json(bestSet)
})

module.exports = {
  createSet,
  getExerciseHistory,
  getExercisePR,
}
