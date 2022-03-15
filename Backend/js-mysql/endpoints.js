import express from "express";

const app = express();
const PORT = 8080;

import mysql from "mysql";

// Prepare to connect to MySQL with your secret environment variables
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
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

app.listen(
  PORT,
)

//1. BPMN: Übersicht bekommen
app.get('/home', (req, res) => {
  const sql1 = "SELECT spiel.heimverein_id, spiel.gastverein_id, spiel.saison, spiel.spieltag, spiel.startzeitpunkt FROM spiel WHERE spiel.zustand = 'Steht noch an' AND DATEDIFF(spiel.startzeitpunkt, CURRENT_DATE) = 0";
  const sql2 = "SELECT spiel.heimverein_id, spiel.gastverein_id, spiel.saison, spiel.spieltag, spiel.startzeitpunkt FROM spiel WHERE spiel.zustand = 'Steht noch an' AND DATEDIFF(spiel.startzeitpunkt, CURRENT_DATE) <= 3";
  connection.query(sql1, function (err, results, fields) {
  if (err) throw err;
  console.log("here are your results", results);
  if(results.length === 0) {
    connection.query(sql2, function (err, results2, fields) {
      if (err) throw err;
      console.log("here are your results", results2);
      res.status(200).send({
        results: results2
      })
    })
  } else {
    res.status(200).send({
      results: results
    })
  }
  }); 
});

//2. BPMN: Ein Match anschauen
app.get('/football/match/:id', (req, res) => {
    if(isNaN(req.params.id)) {
      res.status(400).send({ message: 'Match ID is not viable!' })
    } else {
      const sql = "SELECT spiel.heimverein_id, spiel.gastverein_id, spiel.saison, spiel.spieltag, spiel.startzeitpunkt FROM spiel WHERE spiel.id = " + req.params.id;
      connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        console.log("here are your results", results);
        if(results.length === 0) {
          res.status(204).send({ message: 'Something went wrong. Do you have the right ID? Maybe try again.' })
        } else {
          res.status(200).send({
            results: results
          })
        }
      })
    }
});

//3. BPMN: Fußball-Übersicht
app.get('/football', (req, res) => {
    const sql = "SELECT l.name FROM liga l";
    connection.query(sql, function (err, results, fields) {
      if (err) throw err;
      console.log("here are your results", results);
      if(results.length === 0) {
        res.status(204).send({ message: 'Something went wrong. Seems like there are no Leagues available?' })
      } else {
        res.status(200).send({
           results
        })
      }
    })
})

//4. BPMN: Liga Matches sehen
app.get('/football/:liga_id', (req, res) => {
    const ligaid = req.params.liga_id;
    if(isNaN(ligaid)) {
      res.status(400).send({ message: 'League ID is not viable!' })
    } else { 
      const sql = "SELECT spiel.heimverein_id, spiel.gastverein_id, spiel.saison, spiel.spieltag, spiel.startzeitpunkt FROM spiel WHERE spiel.zustand = 'Steht noch an' AND liga_id = " + ligaid;
      connection.query(sql, function (err, results, fields) {
      if (err) throw err;
      console.log("here are your results", results);
      if(results.length === 0) {
        res.status(204).send({ message: 'No Matches that will be in that League in the near future!' })
      } else {
        res.status(200).send({
           results: results
        })
      }
    })
    }
})

//5. BPMN: Liga vergangene Matches im Zeitraum sehen
app.get('/football/')