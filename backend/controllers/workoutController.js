const asyncHandler = require('express-async-handler')
const Workout = require('../../models/workoutModel')

// Obtener todas las rutinas del usuario logueado
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ user: req.user.id })
    res.status(200).json(workouts)
})

// Crear una rutina
const createWorkout = asyncHandler(async (req, res) => {
    const { reps, peso } = req.body

    if (!reps || !peso) {
        res.status(400)
        throw new Error('Faltan datos')
    }

    const workout = await Workout.create({
        reps,
        peso,
        user: req.user.id
    })

    res.status(201).json(workout)
})

// Actualizar rutina
const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    // Validar usuario dueño
    if (workout.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('No autorizado')
    }

    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(updated)
})

// Eliminar rutina
const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (workout.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('No autorizado')
    }

    await workout.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
}
