//paquetes necesarios para el proyecto
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const controlador = require("./controladores/pelicula.controller");

// Initialization
const app = express();

///
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

// Middlewares
app.use(morgan("dev"));

// Render
app.get("/peliculas", controlador.obtenerPeliculas);
app.get("/generos", controlador.obtenerGeneros);
app.get("/peliculas/recomendacion", controlador.recomendar);
app.get("/peliculas/:id", controlador.obtenerPeliculaPorId);


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = "8080";

app.listen(puerto, function() {
  console.log("Escuchando en el puerto " + puerto);
});
