const express = require('express')
const router = express.Router()

const {
  createSet,
  updateSet,
  deleteSet
} = require('../controllers/setController')

const { protect } = require('../middleware/authMiddleware')


router.post('/', protect, createSet)


router.put('/:id', protect, updateSet)


router.delete('/:id', protect, deleteSet)

module.exports = router
