const asyncHandler = require('express-async-handler')
const Rutina = require('../models/rutinaModel')

// GET /api/rutinas
const getRutinas = asyncHandler(async (req, res) => {
    const rutinas = await Rutina.find({ user_id: req.user.id }).sort({ date: -1 })
    res.status(200).json(rutinas)
})

// POST /api/rutinas
const createRutina = asyncHandler(async (req, res) => {
    const { name, date, exercises } = req.body

    if (!name) {
        res.status(400)
        throw new Error('Por favor proporciona un nombre para la rutina')
    }

    const rutina = await Rutina.create({
        user_id: req.user.id,
        name,
        date: date || Date.now(),
        exercises: exercises || []
    })

    res.status(201).json(rutina)
})

// PUT /api/rutinas/:id
const updateRutina = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (rutina.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Usuario no autorizado')
    }

    const rutinaActualizada = await Rutina.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(rutinaActualizada)
})

// DELETE /api/rutinas/:id
const deleteRutina = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (rutina.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Usuario no autorizado')
    }

    await rutina.deleteOne()
    res.status(200).json({ id: req.params.id })
})

// POST /api/rutinas/:id/ejercicios
const addEjercicio = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (rutina.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Usuario no autorizado')
    }

    const { exercise_name, type, sets } = req.body

    if (!exercise_name) {
        res.status(400)
        throw new Error('Por favor proporciona un nombre para el ejercicio')
    }

    rutina.exercises.push({
        exercise_name,
        type: type || 'strength',
        sets: sets || []
    })

    await rutina.save()
    res.status(200).json(rutina)
})

// PUT /api/rutinas/:id/ejercicios/:exerciseIndex
const updateEjercicio = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (rutina.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Usuario no autorizado')
    }

    const exerciseIndex = parseInt(req.params.exerciseIndex)

    if (exerciseIndex < 0 || exerciseIndex >= rutina.exercises.length) {
        res.status(400)
        throw new Error('Índice de ejercicio inválido')
    }

    rutina.exercises[exerciseIndex] = {
        ...rutina.exercises[exerciseIndex].toObject(),
        ...req.body
    }

    await rutina.save()
    res.status(200).json(rutina)
})

// DELETE /api/rutinas/:id/ejercicios/:exerciseIndex
const deleteEjercicio = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (rutina.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Usuario no autorizado')
    }

    const exerciseIndex = parseInt(req.params.exerciseIndex)

    if (exerciseIndex < 0 || exerciseIndex >= rutina.exercises.length) {
        res.status(400)
        throw new Error('Índice de ejercicio inválido')
    }

    rutina.exercises.splice(exerciseIndex, 1)

    await rutina.save()
    res.status(200).json(rutina)
})

module.exports = {
    getRutinas,
    createRutina,
    updateRutina,
    deleteRutina,
    addEjercicio,
    updateEjercicio,
    deleteEjercicio
}
