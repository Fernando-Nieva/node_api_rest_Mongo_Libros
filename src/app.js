const express = require ('express')
const mongoose = require('mongoose');
const bodyParser= require ('body-parser')
const {config }=require('dotenv')


config()

// Importar las rutas de libros

const bookRoutes =require('./routes/book.routes')

//usamos express para los middlewares
const app = express();
app.use(bodyParser.json());


//conectamos la base de datos:
mongoose.connect(process.env.MONGO_URL,{ dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection;

// Usar las rutas de libros en nuestra aplicación Express
app.use('/books', bookRoutes);


// Iniciar el servidor

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}`));


app.listen (port, ()=>{
    console.log(`Servidor iniciado en elpuerto ${port}`);
})