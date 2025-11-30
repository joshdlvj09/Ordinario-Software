const asyncHandler = require('express-async-handler')
const Workout = require('../models/workoutModel')


// GET /api/workouts
// En Postman: obtener todas las rutinas del usuario.
// Sin body. Solo token.
// Devuelve todas las rutinas guardadas por este usuario.
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ user: req.user.id })
    res.status(200).json(workouts)
})


// POST /api/workouts
// En Postman: crear una rutina simple.
// Body obligatorio:
// { "reps": 10, "peso": 50 }
// Requiere token.
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


// PUT /api/workouts/:id
// En Postman: actualizar una rutina por ID.
// Body: cualquier campo que quieras modificar, por ejemplo:
// { "reps": 12 }
// Requiere token.
const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    // Solo el dueño puede editarla
    if (workout.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('No autorizado')
    }

    const updated = await Workout.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updated)
})


// DELETE /api/workouts/:id
// En Postman: eliminar una rutina por ID.
// Sin body, requiere token.
// Devuelve { id: "..." }
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
