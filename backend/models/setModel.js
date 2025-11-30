const mongoose = require('mongoose')

const setSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    exercise_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Opcional: relacionar con una rutina o workout específico
    rutina_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reps: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    rpe: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Set', setSchema)
