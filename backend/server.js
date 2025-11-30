const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

const port = process.env.PORT || 5000;


connectDB();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/rutinas', require('./routes/rutinaRoutes'));
app.use('/api/workout', require('./routes/workoutRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/sets', require('./routes/setRoutes'));
app.use('/api/weight', require('./routes/weightRoutes'));


app.use(errorHandler);


app.listen(port, () =>
  console.log(`Servidor iniciado en el puerto ${port}`.yellow.bold)
);
