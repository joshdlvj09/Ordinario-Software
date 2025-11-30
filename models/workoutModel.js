const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    reps:{ type: Number,
            required: true
    },
    peso: { type: Number,
            required: true },
});
