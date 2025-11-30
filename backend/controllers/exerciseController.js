const asyncHandler = require('express-async-handler')
const Exercise = require('../models/exerciseModel')


// GET /api/exercises
// En Postman: obtiene todos los ejercicios (predeterminados + personalizados del usuario).
// No lleva body, solo el token.
const getExercises = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const exercises = await Exercise.find({
    $or: [{ user_id: null }, { user_id: userId }],
  }).sort({ name: 1 })

  res.status(200).json(exercises)
})


// POST /api/exercises
// En Postman: crea un ejercicio personalizado.
// Body mínimo:
// { "name": "Press banca" }
// Opcional: muscleGroup, equipment, notes
const createExercise = asyncHandler(async (req, res) => {
  const { name, muscleGroup, equipment, notes } = req.body

  if (!name) {
    res.status(400)
    throw new Error('El nombre del ejercicio es obligatorio')
  }

  const exercise = await Exercise.create({
    user_id: req.user.id,
    name,
    muscleGroup,
    equipment,
    notes,
    isCustom: true,
  })

  res.status(201).json(exercise)
})


// PUT /api/exercises/:id
// En Postman: actualiza un ejercicio personalizado.
// No puedes modificar ejercicios predeterminados (user_id = null).
// Body: solo los campos que quieras cambiar.
const updateExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id)

  if (!exercise) {
    res.status(404)
    throw new Error('Ejercicio no encontrado')
  }

  // No permitir editar ejercicios globales
  if (!exercise.user_id) {
    res.status(403)
    throw new Error('No puedes editar ejercicios predeterminados')
  }

  if (exercise.user_id.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Usuario no autorizado')
  }

  const updated = await Exercise.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.status(200).json(updated)
})


// DELETE /api/exercises/:id
// En Postman: elimina un ejercicio personalizado.
// No se pueden eliminar ejercicios predeterminados.
// Sin body, solo el token.
const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id)

  if (!exercise) {
    res.status(404)
    throw new Error('Ejercicio no encontrado')
  }

  if (!exercise.user_id) {
    res.status(403)
    throw new Error('No puedes eliminar ejercicios predeterminados')
  }

  if (exercise.user_id.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Usuario no autorizado')
  }

  await exercise.deleteOne()

  res.status(200).json({ message: 'Ejercicio eliminado' })
})

module.exports = {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
}
