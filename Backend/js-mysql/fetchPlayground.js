import fetch from 'node-fetch'
globalThis.fetch = fetch
import 'dotenv/config'

import mysql from "mysql";

const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;
const DB = process.env.MYSQL_DB;

// Prepare to connect to MySQL with your secret environment variables
const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB,
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

function fetchBundesligaSaison() {
  fetch('https://www.openligadb.de/api/getmatchdata/bl1/2021')
    .then(res => res.json())
    .then(res => {
        for(let i=0; i<res.length; i++) {
          let matchId = res[i].MatchID;
          let heimverein_id = res[i].Team1.TeamId;
          let gastverein_id = res[i].Team2.TeamId;
          //let ergebnis = res[i].MatchResults[0].PointsTeam1 + ":" + res[i].MatchResults[0].PointsTeam2;
          let zeit = res[i].MatchDateTime;
          let string = zeit.split("T");
          let zustand = res[i].MatchIsFinished ? "Beendet" : "Steht noch an";
          let spieltag = res[i].Group.GroupOrderID;

            console.log("(" + matchId + ", 1, " + heimverein_id + ", " + gastverein_id + ", '" + zustand + "', " + spieltag + ", '" + string[0] + " " + string[1] + "'),");


        }
    })
}


fetchBundesligaSaison();

connection.end();
