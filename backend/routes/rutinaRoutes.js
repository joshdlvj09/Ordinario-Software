const express = require('express')
const router = express.Router()

const {
    getRutinas,
    createRutina,
    updateRutina,
    deleteRutina,
    addEjercicio,
    updateEjercicio,
    deleteEjercicio
} = require('../controllers/rutinaController')

const { protect } = require('../middleware/authMiddleware')

// /api/rutinas
router.route('/')
    .get(protect, getRutinas)
    .post(protect, createRutina)

// /api/rutinas/:id
router.route('/:id')
    .put(protect, updateRutina)
    .delete(protect, deleteRutina)

// /api/rutinas/:id/ejercicios
router.route('/:id/ejercicios')
    .post(protect, addEjercicio)

// /api/rutinas/:id/ejercicios/:exerciseIndex
router.route('/:id/ejercicios/:exerciseIndex')
    .put(protect, updateEjercicio)
    .delete(protect, deleteEjercicio)

module.exports = router
