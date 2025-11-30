const asyncHandler = require('express-async-handler')
const Rutina = require('../models/rutinaModel')


// GET /api/rutinas
// En Postman: trae todas tus rutinas (token obligatorio, sin body)
const getRutinas = asyncHandler(async (req, res) => {
    const rutinas = await Rutina.find({ user_id: req.user.id }).sort({ date: -1 })
    res.status(200).json(rutinas)
})


// GET /api/rutinas/:id
// En Postman: trae una rutina por ID (token obligatorio, sin body)
const getRutinaById = asyncHandler(async (req, res) => {
    const rutina = await Rutina.findById(req.params.id)

    if (!rutina) {
        res.status(404)
        throw new Error('Rutina no encontrada')
    }

    if (rutina.user_id.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Usuario no autorizado')
    }

    res.status(200).json(rutina)
})


// POST /api/rutinas
// En Postman: crea una rutina.
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
// En Postman: actualiza una rutina por su ID.

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
// En Postman: elimina una rutina por ID (solo token, sin body)
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


// POST /api/rutinas/:id/exercises
// En Postman: agrega un ejercicio a la rutina.
// Body mínimo:
// { "exercise_name": "Bench press" }
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


// PUT /api/rutinas/:id/exercises/:exerciseIndex
// En Postman: modifica un ejercicio por índice.
// Body: campos a cambiar (e.g. type, sets, exercise_name)
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


// DELETE /api/rutinas/:id/exercises/:exerciseIndex
// En Postman: elimina un ejercicio por índice (sin body)
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


// GET /api/ejercicios/historial/:exerciseName
// En Postman: muestra todas las veces que has usado ese ejercicio.
// Sin body.
const getHistorialEjercicio = asyncHandler(async (req, res) => {
    const exerciseName = req.params.exerciseName

    const rutinas = await Rutina.find({
        user_id: req.user.id,
        'exercises.exercise_name': exerciseName
    }).sort({ date: -1 })

    const historial = rutinas.map(rutina => {
        const ejercicio = rutina.exercises.find(
            ex => ex.exercise_name === exerciseName
        )
        return {
            date: rutina.date,
            rutina_id: rutina._id,
            rutina_name: rutina.name,
            ejercicio: ejercicio
        }
    })

    res.status(200).json(historial)
})


// GET /api/ejercicios/nombres
// En Postman: devuelve lista de nombres de ejercicios únicos.
// Sin body.
const getNombresEjercicios = asyncHandler(async (req, res) => {
    const rutinas = await Rutina.find({ user_id: req.user.id })

    const nombresUnicos = new Set()
    rutinas.forEach(rutina => {
        rutina.exercises.forEach(ejercicio => {
            nombresUnicos.add(ejercicio.exercise_name)
        })
    })

    res.status(200).json(Array.from(nombresUnicos).sort())
})


module.exports = {
    getRutinas,
    getRutinaById,
    createRutina,
    updateRutina,
    deleteRutina,
    addEjercicio,
    updateEjercicio,
    deleteEjercicio,
    getHistorialEjercicio,
    getNombresEjercicios
}
