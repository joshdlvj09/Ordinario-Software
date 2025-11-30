const asyncHandler = require('express-async-handler')
const WeightEntry = require('../models/weightModel')


// POST /api/weight
// En Postman: agregar un registro de peso.
// Body mínimo:
// { "weight": 75 }
// Opcional: date, notes
// Requiere token.
const addWeightEntry = asyncHandler(async (req, res) => {
  const { date, weight, notes } = req.body

  if (!weight) {
    res.status(400)
    throw new Error('El peso es obligatorio')
  }

  const entry = await WeightEntry.create({
    user_id: req.user.id,
    date,
    weight,
    notes,
  })

  res.status(201).json(entry)
})


// GET /api/weight
// En Postman: obtener historial completo de peso.
// Sin body, solo token.
// Orden ascendente por fecha (del más viejo al más reciente).
const getWeightHistory = asyncHandler(async (req, res) => {
  const entries = await WeightEntry.find({ user_id: req.user.id }).sort({
    date: 1,
  })

  res.status(200).json(entries)
})


// GET /api/weight/latest
// En Postman: obtener el último registro de peso del usuario.
// Sin body, solo token.
// Devuelve el más reciente por fecha.
const getLatestWeight = asyncHandler(async (req, res) => {
  const entry = await WeightEntry.findOne({ user_id: req.user.id })
    .sort({ date: -1 })
    .exec()

  if (!entry) {
    res.status(404)
    throw new Error('No hay registros de peso')
  }

  res.status(200).json(entry)
})

module.exports = {
  addWeightEntry,
  getWeightHistory,
  getLatestWeight,
}
