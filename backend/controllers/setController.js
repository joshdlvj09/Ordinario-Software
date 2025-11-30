const asyncHandler = require('express-async-handler')
const Set = require('../models/setModel')


// POST /api/sets
// En Postman: crea un set (serie) de un ejercicio.

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


// GET /api/sets/history/:exerciseId
// En Postman: historial completo de sets de un ejercicio.
// Sin body. Solo token.
// Ordenado del más reciente al más antiguo.
const getExerciseHistory = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId

  const sets = await Set.find({
    user_id: req.user.id,
    exercise_id: exerciseId,
  }).sort({ date: -1 })

  res.status(200).json(sets)
})


// GET /api/sets/pr/:exerciseId
// En Postman: obtiene tu PR (set con mayor peso; si empata, el de más reps).
// Sin body. Solo token.
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
