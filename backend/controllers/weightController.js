const asyncHandler = require('express-async-handler')
const WeightEntry = require('../../models/weightModel')


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

// @desc    Obtener historial de peso
// @route   GET /api/weight
// @access  Private
const getWeightHistory = asyncHandler(async (req, res) => {
  const entries = await WeightEntry.find({ user_id: req.user.id }).sort({
    date: 1,
  })

  res.status(200).json(entries)
})

// @desc    Obtener último peso registrado
// @route   GET /api/weight/latest
// @access  Private
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
