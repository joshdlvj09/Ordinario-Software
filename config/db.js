const mongoose = require('mongoose');
//await hace que las funcones esperen
// async detiene por ais decirlo las demas funciones de ejecucion hatsa que termine esta funcion
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;