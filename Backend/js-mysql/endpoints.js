import express from "express"
import 'dotenv/config'
import mysql from "mysql";

const app = express();
const PORT = process.env.PORT
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
  port: 3306
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
  const sql1 = "SELECT s.heimverein_id, s.gastverein_id, v1.name AS heimverein, v2.name AS gastverein, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.zustand = 'Steht noch an' AND DATEDIFF(s.startzeitpunkt, CURRENT_DATE) = 0 ORDER BY s.startzeitpunkt";
  const sql2 = "SELECT s.heimverein_id, s.gastverein_id, v1.name AS heimverein, v2.name AS gastverein, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.zustand = 'Steht noch an' AND DATEDIFF(s.startzeitpunkt, CURRENT_DATE) <= 3 ORDER BY s.startzeitpunkt";
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
      const sql = "SELECT s.heimverein_id, s.gastverein_id, v1.name AS heimverein, v2.name AS gastverein, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.id = " + req.params.id;
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
      const sql = "SELECT s.heimverein_id, s.gastverein_id, v1.name AS heimverein, v2.name AS gastverein, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.zustand = 'Steht noch an' AND s.liga_id = " + ligaid + " ORDER BY s.startzeitpunkt";
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

//9: BPMN registrieren
app.get('/football/:email,passwordHash', (req, res) => {
     const sql = " SELECT passwort FROM `users` WHERE email = "+req.params.email+";";
              connection.query(sql, function (err, results, fields) {
              if (err) throw err;
              if(results.length === 0) {
                  const sql = " INSERT INTO `users` (`id`, `email`, `passwort`, `created_at`, `updated_at`, `Kontostand`) VALUES (NULL, '"+req.params.email+"', '"+req.params.passwordHash+"', current_timestamp(), current_timestamp(), '0');";
                               connection.query(sql, function (err, results, fields) {
                               if (err) throw err;
                               })
                 } else{
                 res.status(204).send({ message: 'bereits ein User mit dieser Email' })
                 }
              })
    const sql2 = " SELECT id FROM `users` WHERE email = "+req.params.email+";";
              connection.query(sql2, function (err, results, fields) {
              if (err) throw err;
              res.status(200).send({
                results: results
              })
})

//12: BPMN Verify Login
app.get('/football/:email,passwordHash', (req, res) => {
    const sql = " SELECT passwort FROM `users` WHERE email = '"+req.params.email+"';";
          connection.query(sql, function (err, results, fields) {
          if (err) throw err;
          if(results.length === 0) {
             res.status(204).send({ message: 'kein User mit dieser Email' })
             } else {
                const sql = " SELECT passwort FROM `users` WHERE email = '"+req.params.email+"' AND passwort =" +req.params.passwordHash+";  ";
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
        })

//14: BPMN: change Logindata
app.patch('/football/:newPwHash,userID', (req, res) => {
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
})

//16: BPMN: Odds für ein kommendes Spiel
app.get('/football/:match_id', (req, res) => {
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
})

//17:BPMS echtgeld zu Coins
app.patch('/football/:value,userID', (req, res) => {
    const sql = "UPDATE `users` SET `Kontostand` = `Kontostand` + "+req.params.value+" WHERE `users`.`id` = "+userID+";";
                  connection.query(sql, function (err, results, fields) {
                  if (err) throw err;
                  if(results.length === 0) {
                     res.status(204).send({ message: 'error!' })
                     } else {
                     res.status(200).send({
                       message: 'you have money'
                       })
                     }
                })
})

//18:BPMS coins zu echtgeld
app.patch('/football/:value,userID', (req, res) => {

    const sql = "UPDATE `users` SET `Kontostand` = `Kontostand`-'"+req.params.value+"' WHERE `users`.`id` ="+userID+" AND `Kontostand` >= '"+req.params.value+"'; ";
                  connection.query(sql, function (err, results, fields) {
                  if (err) throw err;
                  if(results.length === 0) {
                     res.status(204).send({ message: 'error!' })
                     } else {
                     res.status(200).send({
                       message: 'you have money'
                       })
                     }
                })
        })
})
//19: BPMS Wetten eintragen
app.post('/football/:hgoal,ggoals,userID,spielID,value', (req, res) => {
         const sql = "INSERT INTO `wetten`(`spiel_id`, `user_id`, `homegoal`, `guestGoal`, `value`) VALUES ('"+spielID+"','"+userID+"','"+hgoal+"','"+ggoal+"','"+value+"')";
               connection.query(sql, function (err, results, fields) {
               if (err) throw err;
               console.log("new bet created", results);
               if(results.length === 0) {
                  res.status(204).send({ message: 'error!' })
                  } else {
                  res.status(200).send({
                    message: 'new bet created'
                    })
                  }
             })
})
