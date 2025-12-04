const asyncHandler = require('express-async-handler')
const Set = require('../models/setModel')


// POST /api/sets
// Crea un set
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
    rpe
  })

  res.status(201).json(set)
})


// PUT /api/sets/:id
// Modifica un set
const updateSet = asyncHandler(async (req, res) => {
  const set = await Set.findById(req.params.id)

  if (!set) {
    res.status(404)
    throw new Error('Set no encontrado')
  }

  if (set.user_id.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Usuario no autorizado')
  }

  const updated = await Set.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.status(200).json(updated)
})


// DELETE /api/sets/:id
// Elimina un set
const deleteSet = asyncHandler(async (req, res) => {
  const set = await Set.findById(req.params.id)

  if (!set) {
    res.status(404)
    throw new Error('Set no encontrado')
  }

  if (set.user_id.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Usuario no autorizado')
  }

  await set.deleteOne()

  res.status(200).json({ id: req.params.id })
})


module.exports = {
  createSet,
  updateSet,
  deleteSet
}
