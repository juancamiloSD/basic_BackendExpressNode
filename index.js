require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor espress
const app = express();


// Configurar cors
app.use(cors());

// LEctura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();


// Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' + process.env.PORT);
});