const mongoose = require('mongoose')

const exerciseSchema = mongoose.Schema(
  {

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Nombre del ejercicio obligatorio'],
      trim: true,
    },
    muscleGroup: {
      type: String,
      trim: true,
    },
    equipment: {
      type: String,
      trim: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Exercise', exerciseSchema)
