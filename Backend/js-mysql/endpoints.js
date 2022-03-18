import express from "express"
import 'dotenv/config'
import mysql from "mysql";
import cron from "node-cron";
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT
const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;
const SQL_PORT = process.env.MYSQL_PORT;
const DB = process.env.MYSQL_DB;


// Prepare to connect to MySQL with your secret environment variables
const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB,
  port: SQL_PORT
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

app.use(cors());
app.listen(
  PORT,
)

//1. BPMN: Übersicht bekommen
app.get('/home', (req, res) => {
  const sql1 = "SELECT s.id, s.heimverein_id, s.gastverein_id, v1.logourl AS heimlogo, v1.name AS heimverein, s.heim_points, v2.logourl AS gastlogo, v2.name AS gastverein, s.gast_points, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.zustand = 'Steht noch an' AND DATEDIFF(s.startzeitpunkt, CURRENT_DATE) = 0 ORDER BY s.startzeitpunkt";
  const sql2 = "SELECT s.id, s.heimverein_id, s.gastverein_id, v1.logourl AS heimlogo, v1.name AS heimverein, s.heim_points, v2.logourl AS gastlogo, v2.name AS gastverein, s.gast_points, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.zustand = 'Steht noch an' AND DATEDIFF(s.startzeitpunkt, CURRENT_DATE) <= 3 ORDER BY s.startzeitpunkt";
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
      const sql = "SELECT s.id, s.heimverein_id, s.gastverein_id, v1.logourl AS heimlogo, v1.name AS heimverein, s.heim_points, v2.logourl AS gastlogo, v2.name AS gastverein, s.gast_points, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.id = " + req.params.id;
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
    const sql = "SELECT l.id, l.name FROM liga l";
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
      const sql = "SELECT s.id, s.heimverein_id, s.gastverein_id, v1.name AS heimverein, v2.name AS gastverein, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.zustand = 'Steht noch an' AND s.liga_id = " + ligaid + " ORDER BY s.startzeitpunkt";
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
app.post('/football/:liga_id/:start/:end', (req, res) => {

})

//8. BPMN: aktualisieren der Datensätze
//Aktualisieren der Wetten
cron.schedule("* * * * * *", function() {

})

//Aktualisieren der Spiele (Ergebnisse / Tore)
cron.schedule("59 23 * * *", function() {
  fetch('https://www.openligadb.de/api/getmatchdata/bl1/2021')
  .then(res => res.json())
  .then(res => {
    for(let i=0; i<res.length; i++) {
      let matchId = res[i].MatchID;
      let zustand = res[i].MatchIsFinished ? "Beendet" : "Steht noch an";
      if(zustand === "Steht noch an") {
        let ergebnis = null;
        let heimpoints = null;
        let gastpoints = null;
        updateMatches(matchId, ergebnis, zustand, heimpoints, gastpoints);
      } else {
        let ergebnis = res[i].MatchResults[0].PointsTeam1 + ":" + res[i].MatchResults[0].PointsTeam2;
        let heimpoints = res[i].MatchResults[0].PointsTeam1;
        let gastpoints = res[i].MatchResults[0].PointsTeam2;
        updateMatches(matchId, ergebnis, zustand, heimpoints, gastpoints);
      }
    }
  })
});

function updateMatches(matchId, ergebnis, zustand, heimpoints, gastpoints) {
  console.log("fck");
  const updateZustand = "UPDATE spiel s SET s.zustand = '" + zustand + "' WHERE s.id = " + matchId;
          connection.query(updateZustand, function (err, results, fields) {
          if (err) throw err;
            console.log("here are your results", results);
          })
  const updateErgebnis = "UPDATE spiel s SET s.ergebnis = '" + ergebnis + "' WHERE s.id = " + matchId;
          connection.query(updateErgebnis, function (err, results, fields) {
          if (err) throw err;
            console.log("here are your results", results);
          })
  const updateHeimpoints = "UPDATE spiel s SET s.heim_points = " + heimpoints + " WHERE s.id = " + matchId;
          connection.query(updateHeimpoints, function (err, results, fields) {
            if (err) throw err;
              console.log("here are your results", results);
            })
  const updateGastpoints = "UPDATE spiel s SET s.gast_points = " + gastpoints + " WHERE s.id = " + matchId;
          connection.query(updateGastpoints, function (err, results, fields) {
            if (err) throw err;
              console.log("here are your results", results);
            })
}

//9: BPMN registrieren
app.get('/register/:email/:passwordHash', (req, res) => {
     try {
          const sql = " SELECT * FROM `users` WHERE email = '"+req.params.email+"';";
                   connection.query(sql, function (err, results, fields) {
                   if (err) throw err;
                   if(results.length === 0) {
                       const sql = " INSERT INTO `users` (`id`, `email`, `passwort`, `created_at`, `updated_at`, `Kontostand`) VALUES (NULL, '"+req.params.email+"', '"+req.params.passwordHash+"', current_timestamp(), current_timestamp(), '0');";
                                    connection.query(sql, function (err, results, fields) {
                                    if (err) throw err;
                                    res.status(200).send(results)
                                    //die id des neuen Users ist in insertId gespeichert
                                    })
                      } else{
                      res.status(204).send({ message: 'bereits ein User mit dieser Email' })
                      }
                   })
     }
     catch{
      res.status(204).send({ message: 'error!' })
     }
});

//12: BPMN Verify Login
//noch nicht richtige funktion
app.get('/Vlogin/:email/:passwordHash', (req, res) => {
    const sql = " SELECT email FROM `users` WHERE email = '"+req.params.email+"';";
          connection.query(sql, function (err, results, fields) {
          if (err) throw err;
          if(results.length === 0) {
             res.status(204).send({ message: 'kein User mit dieser Email' })
          } else {
                const sql = " SELECT id,Kontostand  FROM `users` WHERE email = '"+req.params.email+"' AND passwort ='" +req.params.passwordHash+"';  ";
                connection.query(sql, function (err, results, fields) {
                if (err) throw err;
                if(results.length === 0) {
                   res.status(204).send({ message: 'falsches Passwort' })
                } else {
                    console.log("login erfolg");
                    res.status(200).send({
                    results: results
                    })
                    }
                })
          }
    })
});

//14: BPMN: change Logindata
app.patch('/changeLoginData/:newPwHash/:userID', (req, res) => {
    try{
        const sql = "UPDATE `users` SET `Passwort` = `newPwHash` WHERE `users`.`id` = "+userID+";";
                      connection.query(sql, function (err, results, fields) {
                      if (err) throw err;
                      if(results.length === 0) {
                         res.status(204).send({ message: 'error!' })
                         } else {
                         res.status(200).send({
                           message: 'changed Password'
                           })
                         }
                    })
    }
    catch{
    res.status(204).send({ message: 'error!' })
    }

});

//15: BPMN Data for Homescreen
app.get('/homescreen/:userID', (req, res) => {
    try {

    }
    catch(e){
    res.status(204).send({ message: 'error!' })
    }

});

//16: BPMN: Odds für ein kommendes Spiel
app.get('/odds/:match_id', (req, res) => {
    try{
        const sql = "SELECT oddhome,oddsDraw,oddGuest FROM `matchodds` m, `spiel` s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id where s.id ="+req.params.match_id+" AND v1.altName = m.hometeam_altName AND v2.altName = m.guestteam_altName; ";
              connection.query(sql, function (err, results, fields) {
              if (err) throw err;
              console.log("these are youre Odds", results);
              if(results.length === 0) {
                 res.status(204).send({ message: 'error!' })
              } else {
                 res.status(200).send({
                   results: results
                 })
              }
        })
    }
    catch
    {
    res.status(204).send({ message: 'error!' })
    }

});

//17:BPMS echtgeld zu Coins
app.get('/sendMoney/:userID/:value', (req, res) => {
    try {
    const sql = "UPDATE `users` SET `Kontostand` = `Kontostand` + "+req.params.value+" WHERE `users`.`id` = '"+req.params.userID+"';";
                      connection.query(sql, function (err, results, fields) {
                      if (err) throw err;
                      if(results.length === 0) {
                         //res.status(204).send({ message: 'error!' })
                         } else {
                         //res.status(200).send(results)
                         }
                    })
        const sql2 = "Select Kontostand From `users` WHERE `users`.`id` = '"+req.params.userID+"';";
        connection.query(sql2, function (err, results, fields) {
            if (err) throw err;
            if(results.length === 0) {
            res.status(204).send({ message: 'error!' })
            } else {
            res.status(200).send(results)
            }
        })
    }
    catch(e){
    res.status(204).send({ message: 'error!' })
    }

});

//18:BPMS coins zu echtgeld
app.get('/receiveMoney/:userID/:value', (req, res) => {
    try{
      const sql = "UPDATE `users` SET `Kontostand` = `Kontostand`-'"+req.params.value+"' WHERE `users`.`id` ="+req.params.userID+" AND `Kontostand` >= '"+req.params.value+"'; ";
        connection.query(sql, function (err, results, fields) {
            if (err) throw err;
            if(results.length === 0) {
                //res.status(204).send({ message: 'error!' })
            } else {
                //res.status(200).send(results)
            }
        })
        const sql2 = "Select Kontostand From `users` WHERE `users`.`id` = '"+req.params.userID+"';";
        connection.query(sql2, function (err, results, fields) {
            if (err) throw err;
            if(results.length === 0) {
                res.status(204).send({ message: 'error!' })
            } else {
                res.status(200).send(results)
            }
        })
    }
    catch(e)
    {
        res.status(204).send({ message: 'error!' })
    }
});

//19: BPMS Wetten eintragen
app.get('/placeBet/:hgoal/:ggoals/:userID/:spielID/:value', (req, res) => {
         try{
            const sql = "INSERT INTO `wetten`(`spiel_id`, `user_id`, `homegoal`, `guestGoal`, `value`) VALUES ('"+req.params.spielID+"','"+req.params.userID+"','"+req.params.hgoal+"','"+req.params.ggoal+"','"+req.params.value+"')";
                        connection.query(sql, function (err, results, fields) {
                        if (err) throw err;
                        if(results.length === 0) {
                           res.status(204).send({ message: 'error!' })
                           } else {
                           res.status(200).send({
                             message: 'new bet created'
                             })
                           }
                      })
         }
         catch
         {
              res.status(204).send({ message: 'error!' })
         }
});

//20: BPMS Wette löschen
app.get('/deleteBet/:betID', (req, res) => {
         try{
            const sql = "DELETE FROM `wetten` WHERE `wetten`.`id` = '"+req.params.betID+"';";
                        connection.query(sql, function (err, results, fields) {
                        if (err) throw err;
                        console.log("new bet created", results);
                        if(results.length === 0) {
                           res.status(204).send({ message: 'error!' })
                           } else {
                           res.status(200).send({
                             message: 'bet deleted'
                             })
                           }
                      })
         }
         catch
         {
              res.status(204).send({ message: 'error!' })
         }
});

//21: BPMS Wetten einsehen
app.get('/getBets/:userID', (req, res) => {
         try{
            const sql = "Select * FROM `wetten` WHERE `wetten`.`user_id` = '"+req.params.userID+"';";
                        connection.query(sql, function (err, results, fields) {
                        if (err) throw err;
                        if(results.length === 0) {
                           res.status(204).send({ message: 'error!' })
                           } else {
                           res.status(200).send(results)
                           }
                      })
         }
         catch
         {
              res.status(204).send({ message: 'error!' })
         }
});
