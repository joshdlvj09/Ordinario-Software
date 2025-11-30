const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./backend/config/db');
const { errorHandler } = require('./backend/middleware/errorMiddleware');
const cors = require('cors');

const port = process.env.PORT || 5000;


connectDB();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/users', require('./backend/routes/usersRoutes'));
app.use('/api/rutinas', require('./backend/routes/rutinaRoutes'));
app.use('/api/workout', require('./backend/routes/workoutRoutes'));
app.use('/api/exercises', require('./backend/routes/exerciseRoutes'));
app.use('/api/sets', require('./backend/routes/setRoutes'));
app.use('/api/weight', require('./backend/routes/weightRoutes'));


app.use(errorHandler);


app.listen(port, () =>
  console.log(`Servidor iniciado en el puerto ${port}`.yellow.bold)
);
