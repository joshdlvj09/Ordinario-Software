const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/rutinaController')
const { protect } = require('../middleware/authMiddleware')


router.route('/')
    .get(protect, getRutinas)
    .post(protect, createRutina)


router.get('/ejercicios/nombres', protect, getNombresEjercicios)


router.get('/historial/:exerciseName', protect, getHistorialEjercicio)


router.route('/:id')
    .get(protect, getRutinaById)
    .put(protect, updateRutina)
    .delete(protect, deleteRutina)


router.route('/:id/ejercicios')
    .post(protect, addEjercicio)

router.route('/:id/ejercicios/:exerciseIndex')
    .put(protect, updateEjercicio)
    .delete(protect, deleteEjercicio)

module.exports = router

