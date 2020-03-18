const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "$Pass123",
  database: "acamica"
});

module.exports = connection;
