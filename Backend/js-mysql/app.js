// This loads the settings from your `.env` file.
require("dotenv").config();

// This imports the mysql library
const mysql = require("mysql");

// Prepare to connect to MySQL with your secret environment variables
const connection = mysql.createConnection({
  host: process.env.MYSQL,
  user: process.env.MYSQL_USER,
  password: "",
  database: "liga_db",
  port: 3308
});

// Make the connection
connection.connect(function (err) {
  // Check if there is a connection error
  if (err) {
      console.log("connection error", err.stack);
      return;
  }

  // If there was no error, print this message
  console.log(`connected to database`);
});

const sql = "SELECT * FROM land";
connection.query(sql, function (err, results, fields) {
  if (err) throw err;

  console.log("here are your results", results);
}); 

connection.end();