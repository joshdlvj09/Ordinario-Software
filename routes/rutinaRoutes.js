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

// Rutas para rutinas
router.route('/')
    .get(protect, getRutinas)
    .post(protect, createRutina)

// Ruta para obtener nombres de ejercicios únicos
router.get('/ejercicios/nombres', protect, getNombresEjercicios)

// Ruta para obtener historial de un ejercicio específico
router.get('/historial/:exerciseName', protect, getHistorialEjercicio)

// Rutas para una rutina específica
router.route('/:id')
    .get(protect, getRutinaById)
    .put(protect, updateRutina)
    .delete(protect, deleteRutina)

// Rutas para ejercicios dentro de una rutina
router.route('/:id/ejercicios')
    .post(protect, addEjercicio)

router.route('/:id/ejercicios/:exerciseIndex')
    .put(protect, updateEjercicio)
    .delete(protect, deleteEjercicio)

module.exports = router

