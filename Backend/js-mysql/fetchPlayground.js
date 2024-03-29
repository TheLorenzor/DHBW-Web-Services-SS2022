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
  fetch('https://www.openligadb.de/api/getmatchdata/bl1/2015')
    .then(res => res.json())
    .then(res => {
        for(let i=0; i<res.length; i++) {
          let matchId = res[i].MatchID;
          let heimverein_id = res[i].Team1.TeamId;
          let gastverein_id = res[i].Team2.TeamId;
          let ergebnis = res[i].MatchResults[0].PointsTeam1 + ":" + res[i].MatchResults[0].PointsTeam2;
          let zeit = res[i].MatchDateTime;
          let string = zeit.split("T");
          let zustand = res[i].MatchIsFinished ? "Beendet" : "Steht noch an";
          let spieltag = res[i].Group.GroupOrderID;
          let heimpoints = res[i].MatchResults[0].PointsTeam1;
          let gastpoints = res[i].MatchResults[0].PointsTeam2;

            console.log("(" + matchId + ", 1, '2015/2016', " + heimverein_id + ", " + gastverein_id + ", '" + ergebnis + "', '" + zustand + "', " + spieltag + ", '" + string[0] + " " + string[1] + "', " + heimpoints + ", " + gastpoints + "),");
        }
    })
}

function fetchNewOdds() {
  //fetch data
    fetch('https://api.the-odds-api.com/v4/sports/soccer_germany_bundesliga/odds/?regions=eu&markets=h2h&apiKey=aab6fa5774ec2af0b08b95eef17e9b58')
        .then(res => res.json())
        .then(res => {
            for(let i=0; i<res.length; i++) {
               //sort data
                let heimverein_altName = res[i].home_team;
                let gastverein_altName = res[i].away_team;
                let oddGuest = res[i].bookmakers[1].markets[0].outcomes[0].price;
                let oddhome = res[i].bookmakers[1].markets[0].outcomes[1].price;
                let oddsDraw = res[i].bookmakers[1].markets[0].outcomes[2].price;

                console.log("(" + heimverein_altName +" "+gastverein_altName + " " + oddGuest + ", " + oddhome + ", '" + oddsDraw + "'),");
            }
        })
}

fetchBundesligaSaison();
//fetchNewOdds();

connection.end();
