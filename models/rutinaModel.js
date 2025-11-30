const mongoose = require('mongoose')

const setSchema = mongoose.Schema({
    set_number: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    weight_kg: {
        type: Number,
        required: true,
        default: 0
    }
}, { _id: false })

const exerciseSchema = mongoose.Schema({
    exercise_name: {
        type: String,
        required: [true, "Por favor escribe el nombre del ejercicio"]
    },
    type: {
        type: String,
        enum: ['strength', 'cardio'],
        default: 'strength'
    },
    sets: [setSchema]
}, { _id: false })

const rutinaSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: [true, "Por favor escribe un nombre de rutina"]
    },
    exercises: [exerciseSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('Rutina', rutinaSchema)