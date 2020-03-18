const conn = require("../lib/conexionbd");

// Obtener peliculas
function obtenerPeliculas(req, res) {
  var anio = req.query.anio;
  var titulo = req.query.titulo;
  var genero = req.query.genero;
  var orden = req.query.columna_orden;
  var tipo_orden = req.query.tipo_orden;
  var pagina = req.query.pagina;
  var cantidad = req.query.cantidad;
  var limite = `${(pagina - 1) * cantidad},${cantidad}`;

  if (anio) {
    sql = `select * from pelicula where anio=${anio} limit ${limite} `;
  } else if (titulo) {
    sql =
      "select * from pelicula where titulo like '" +
      titulo +
      "%" +
      "' limit " +
      limite;
  } else if (genero) {
    sql =
      "select * from pelicula where genero_id = '" +
      genero +
      "' limit " +
      limite;
  } else if (orden) {
    var sql = `select * from pelicula order by ${orden} ${tipo_orden} limit ${limite}`;
  } else {
    var sql = `select * from pelicula limit ${limite}`;
  }
  var sqlTotal = `select count(*) as total from pelicula`;
  conn.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    conn.query(sqlTotal, function(err, result, fields) {
      if (err) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      if (result.length == 0) {
        console.log("No se contó la cantidad de películas");
        return res.status(404).send("Error de calculos");
      } else {
        var response = {
          total: result[0].total,
          peliculas: resultado
        };
        res.send(JSON.stringify(response));
      }
    });
  });
}

// Obtener géneros
function obtenerGeneros(req, res) {
  var sql = "select * from genero";
  conn.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    var response = {
      generos: resultado
    };
    res.send(JSON.stringify(response));
  });
}

// Peliculas por ID
function obtenerPeliculaPorId(req, res) {
  var id = req.params.id;
  var sql = `select p.id, p.titulo, p.anio ,p.duracion ,p.director, p.fecha_lanzamiento, p.puntuacion, p.poster, 
  p.trama, g.nombre as genero, a.nombre  from pelicula p join genero g on p.genero_id = g.id  join actor_pelicula ac on ac.pelicula_id = p.id join actor a on ac.actor_id=a.id where p.id= ${id}`;
  conn.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado.length == 0) {
      console.log("No se ha encotrado una pelicula con ese id");
      return res.status(404).send("No existe una película con ese id");
    } else {
      var response = {
        pelicula: resultado[0],
        actores: resultado,
        genero: resultado[0].genero
      };
    }
    res.send(JSON.stringify(response));
  });
}

/*	---<><>---<><>---	/
  |---/	Recomendar peliculas	/---|
/	---<><>---<><>---	*/

function recomendar(req, res) {
  var genero = req.query.genero;
  var anio_inicio = req.query.anio_inicio;
  var anio_fin = req.query.anio_fin;
  var puntuacion = req.query.puntuacion;

  if (anio_inicio !== undefined && anio_fin !== undefined) {
    if (genero !== undefined) {
      var sql =
        "SELECT p.id, p.poster, p.trama, p.titulo, g.nombre  FROM pelicula p JOIN genero g ON p.genero_id=g.id  WHERE g.nombre='" +
        genero +
        "' AND p.anio BETWEEN '" +
        anio_inicio +
        "' AND '" +
        anio_fin +
        "'";
    } else {
      var sql =
        "SELECT p.id, p.poster, p.trama, p.titulo, g.nombre  FROM pelicula p JOIN genero g ON p.genero_id=g.id WHERE p.anio BETWEEN '" +
        anio_inicio +
        "' AND '" +
        anio_fin +
        "'";
    }
  } else if (puntuacion !== undefined) {
    if (genero !== undefined) {
      var sql =
        "SELECT p.id, p.poster, p.trama, p.titulo, g.nombre  FROM pelicula p JOIN genero g ON p.genero_id=g.id  WHERE g.nombre='" +
        genero +
        "' AND p.puntuacion= '" +
        puntuacion +
        "'";
    } else {
      var sql =
        "SELECT p.id, p.poster, p.trama, p.titulo, g.nombre  FROM pelicula p JOIN genero g ON p.genero_id=g.id WHERE p.puntuacion='" +
        puntuacion +
        "'";
    }
  } else if (genero !== undefined) {
    var sql =
      "SELECT p.id, p.poster, p.trama, p.titulo, g.nombre FROM pelicula p JOIN genero g ON p.genero_id=g.id  WHERE g.nombre='" +
      genero +
      "'";
  } else {
    var sql =
      "SELECT p.id, p.poster, p.trama, p.titulo, g.nombre FROM pelicula p JOIN genero g ON p.genero_id=g.id";
  }

  conn.query(sql, function(error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta ");
    }
    if (resultado.length == 0) {
      console.log("No se han encotrado peliculas para recomendar");
      return res.status(404).send("No hay películas");
    } else {
      var response = {
        peliculas: resultado
      };
      res.send(JSON.stringify(response));
    }
  });
}

module.exports = {
  obtenerPeliculas: obtenerPeliculas,
  obtenerGeneros: obtenerGeneros,
  obtenerPeliculaPorId: obtenerPeliculaPorId,
  recomendar: recomendar
};
