import express from "express"
import 'dotenv/config'
import mysql from "mysql";
import cron from "node-cron";
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;


// Prepare to connect to MySQL with your secret environment variables
const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: "liga_db",
  PORT: 3306
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
  8080,
)

//1. BPMN: Übersicht bekommen
app.get('/home', (req, res) => {
  try{
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
}
catch{
res.status(204).send({ message: 'error!' })
}
});

//2. BPMN: Ein Match anschauen
app.get('/football/match/:id', (req, res) => {
  try{
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
  }
  catch{
  res.status(204).send({ message: 'error!' })
  }
});

//3. BPMN: Fußball-Übersicht
app.get('/football', (req, res) => {
  try{
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
  }
  catch{
  res.status(204).send({ message: 'error!' })
  }
})

//4. BPMN: Liga Matches sehen
app.get('/football/:liga_id', (req, res) => {
  try{
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
  }
  catch{
  res.status(204).send({ message: 'error!' })
  }
})

//5. BPMN: Verschiedene Torstatistiken sehen
app.get('/goalstatistics', (req, res) => {
  try{
    const sqlElfer = "SELECT COUNT(isPenalty) AS Elfmetertore FROM tore WHERE isPenalty = 'true'";
    const sqlNachspielzeit = "SELECT COUNT(isOvertime) AS Nachspielzeit FROM tore WHERE isOvertime = 'true'";
    const sqlEigentor = "SELECT COUNT(isOwnGoal) AS Eigentore FROM tore WHERE isOwnGoal = 'true'";
    const toreInHz1 = "SELECT COUNT(minuteanzahl) AS ToreHz1 FROM tore WHERE minuteanzahl < 45";
    const toreInHz2 = "SELECT COUNT(minuteanzahl) AS ToreHz2 FROM tore WHERE minuteanzahl > 45";
    //const top10scorer = "SELECT ts.name, COUNT(t.torschuetze_id) AS AnzahlTore FROM torschuetze ts JOIN tore t ON ts.id = t.torschuetze_id ORDER BY AnzahlTore DESC LIMIT 10";
    connection.query(sqlElfer, function (err, results, fields) {
    if (err) throw err;
      connection.query(sqlNachspielzeit, function (err, results2, fields) {
        if (err) throw err;
        connection.query(sqlEigentor, function (err, results3, fields) {
          if (err) throw err;
          connection.query(toreInHz1, function (err, results4, fields) {
            if (err) throw err;
            connection.query(toreInHz2, function (err, results5, fields) {
              if (err) throw err;
              //connection.query(top10scorer, function (err, results6, fields) {
                //if (err) throw err;
              if(results.length === 0 || results2.length === 0 || results3.length === 0 || results4.length === 0 || results5.length === 0) {
                res.status(204).send({ message: 'There was an error retrieving the data.' })
              } else {
                res.status(200).send({
                  Elfer: results,
                  Nachspielzeit:  results2,
                  Eigentore:  results3,
                  ToreHz1: results4,
                  ToreHz2: results5,
                  //Top10: results6
                })
              }
            })
          })
        })
      })
    //})
    }
  )
}
catch{
res.status(204).send({ message: 'error!' })
}
})

//6. BPMN: Ansehen der Mannschaften der Bundesliga
app.get('/contenders', (req, res) => {
  try{
    const sql = "SELECT v.id, v.logourl, v.name FROM verein v WHERE v.isErsteBundesliga = 'true'";
        connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        console.log("here are your results", results);
        if(results.length === 0) {
          res.status(204).send({ message: 'There was a problem listing the clubs!' })
        } else {
          res.status(200).send({
            results: results
          })
        }
      })
    }
    catch{
    res.status(204).send({ message: 'error!' })
    }
})

//7. BPMN: aktualisieren der Datensätze
//Aktualisieren der Wetten
cron.schedule("58 23 * * *", function() {
  fetch('https://api.the-odds-api.com/v4/sports/soccer_germany_bundesliga/odds/?regions=eu&markets=h2h&apiKey=aab6fa5774ec2af0b08b95eef17e9b58%27')
        .then(res => res.json())
        .then(res => {
            for(let i=0; i<1; i++) {
                let heimverein_altName = res[i].home_team;
                let gastverein_altName = res[i].away_team;
                let oddGuest = res[i].bookmakers[1].markets[0].outcomes[0].price;
                let oddhome = res[i].bookmakers[1].markets[0].outcomes[1].price;
                let oddsDraw = res[i].bookmakers[1].markets[0].outcomes[2].price;
                updateOdds(oddGuest, oddhome, oddsDraw,heimverein_altName,gastverein_altName);
            }
        })
})

function updateOdds(oddGuest, oddhome, oddsDraw,heimverein_altName,gastverein_altName) {
  const newMatchodds = "INSERT IGNORE INTO `matchodds` (`ID`, `hometeam_altName`, `guestteam_altName`, `oddhome`, `oddsDraw`, `oddGuest`) VALUES (NULL, '"+heimverein_altName+"', '"+gastverein_altName+"', '"+oddhome+"', '"+oddsDraw+"', '"+oddGuest+"');";
  connection.query(newMatchodds, function (err, results, fields) {
  if (err) throw err;
    console.log("new odds arrived", results);
  })
}

//Aktualisieren der Torschützen
cron.schedule("58 23 * * *", function() {
  try{
    fetch('https://www.openligadb.de/api/getmatchdata/bl1/2021')
    .then(res => res.json())
    .then(res => {
      for(let i=0; i<res.length; i++) {
        for(let k=0; k<res[i].Goals.length; k++) {
          let goalGetterId = res[i].Goals[k].GoalGetterID;
          let goalGetterName = res[i].Goals[k].GoalGetterName;
          if(goalGetterId === 18764) {
            goalGetterName = null;
            updateGoalGetter(goalGetterId, goalGetterName);
          } else {
            updateGoalGetter(goalGetterId, goalGetterName);
          }
        }
      }
    })
  }
  catch{
  res.status(204).send({ message: 'error!' })
  }
})

function updateGoalGetter(goalGetterId, goalGetterName) {
  const updateGoalGetterss = "INSERT IGNORE INTO torschuetze VALUES (" + goalGetterId + ", '" + goalGetterName + "')";
  connection.query(updateGoalGetterss, function (err, results, fields) {
  if (err) throw err;
    console.log("here are your results", results);
  })
}

//Aktualisieren der Tore
cron.schedule("59 23 * * *", function() {
  try{
    fetch('https://www.openligadb.de/api/getmatchdata/bl1/2021')
    .then(res => res.json())
    .then(res => {
        for(let i=0; i<res.length; i++) {
          let matchId = res[i].MatchID;
          for(let k=0; k<res[i].Goals.length; k++) {
            let goalId = res[i].Goals[k].GoalID;
            let goalGetterId = res[i].Goals[k].GoalGetterID;
            let minuteanzahl = res[i].Goals[k].MatchMinute;
            let isOvertime = res[i].Goals[k].IsOvertime;
            let isPenalty = res[i].Goals[k].IsPenalty;
            let isOwnGoal = res[i].Goals[k].IsOwnGoal;
            let heimpoints =  res[i].Goals[k].ScoreTeam1;
            let gastpoints =  res[i].Goals[k].ScoreTeam2;
            updateGoals(matchId, goalId, goalGetterId, minuteanzahl, isOvertime, isPenalty, isOwnGoal, heimpoints, gastpoints);
          }
        }
    })
  }
  catch{
  res.status(204).send({ message: 'error!' })
  }
})

function updateGoals(matchId, goalId, goalGetterId, minuteanzahl, isOvertime, isPenalty, isOwnGoal, heimpoints, gastpoints) {
  const updateGoalGetterss = "INSERT IGNORE INTO tore VALUES (" + goalId + ", " + matchId + ", " + goalGetterId + ", " + minuteanzahl + ", '" + isPenalty + "', '" + isOvertime + "', '" + isOwnGoal + "', " + heimpoints + ", " + gastpoints + ")";
  connection.query(updateGoalGetterss, function (err, results, fields) {
  if (err) throw err;
    console.log("here are your results", results);
  })
}

//Aktualisieren der Spiele (Ergebnisse / Tore)
cron.schedule("59 23 * * *", function() {
  try {
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
}
catch{
res.status(204).send({ message: 'error!' })
}
});

function updateMatches(matchId, ergebnis, zustand, heimpoints, gastpoints) {
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

//8: BPMN registrieren
app.get('/register/:email/:passwordHash', (req, res) => {
     try {
          const sql = " SELECT * FROM `users` WHERE email = '"+req.params.email+"';";
                   connection.query(sql, function (err, results, fields) {
                   if (err) throw err;
                   if(results.length === 0) {
                       const sql = " INSERT INTO `users` (`id`, `email`, `passwort`, `created_at`, `updated_at`, `bankaccount`) VALUES (NULL, '"+req.params.email+"', '"+req.params.passwordHash+"', current_timestamp(), current_timestamp(), '0');";
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


//9: BPMN Verify Login
//noch nicht richtige funktion
app.get('/Vlogin/:email/:passwordHash', (req, res) => {
    const sql = " SELECT email FROM `users` WHERE email = '"+req.params.email+"';";
          connection.query(sql, function (err, results, fields) {
          if (err) throw err;
          if(results.length === 0) {
             res.status(204).send({ message: 'kein User mit dieser Email' })
          } else {
                const sql = " SELECT id,bankaccount  FROM `users` WHERE email = '"+req.params.email+"' AND passwort ='" +req.params.passwordHash+"';  ";
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

//10: BPMN: change Logindata
app.get('/changeLoginData/:newPwHash/:userID', (req, res) => {
    try{
        const sql = "UPDATE `users` SET passwort = "+newPwHash+" WHERE users.id = "+userID+";";
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

//11: BPMN: Odds für ein kommendes Spiel
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

//12:BPMS echtgeld zu Coins
app.get('/sendMoney/:userID/:value', (req, res) => {
    try {
    pay(req.params.userID,req.params.value)
    const sql = "Select bankaccount From `users` WHERE `users`.`id` = '"+req.params.userID+"';";
        connection.query(sql, function (err, results, fields) {
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

//13:BPMS coins zu echtgeld
app.get('/receiveMoney/:userID/:value', (req, res) => {
    try{
      const sql = "UPDATE `users` SET `bankaccount` = `bankaccount`-'"+req.params.value+"' WHERE `users`.`id` ="+req.params.userID+" AND `Kontostand` >= '"+req.params.value+"'; ";
        connection.query(sql, function (err, results, fields) {
            if (err) throw err;
            if(results.length === 0) {
                //res.status(204).send({ message: 'error!' })
            } else {
                //res.status(200).send(results)
            }
        })
        const sql2 = "Select bankaccount From `users` WHERE `users`.`id` = '"+req.params.userID+"';";
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

//14: BPMS Wetten eintragen
app.get('/placeBet/:hgoal/:ggoals/:userID/:spielID/:value/:odd', (req, res) => {
          const sql = "Select * FROM `wetten` WHERE `wetten`.`user_id` = '"+req.params.userID+"' AND `wetten`.`spiel_id` = '"+req.params.spielID+"';";
                                 connection.query(sql, function (err, results, fields) {
                                     if (err) throw err;
                                     if(results.length === 0) {
                                                try{
                                                   const sql = "INSERT INTO `wetten`(`spiel_id`, `user_id`, `homegoal`, `guestGoal`, `value`,`open`,`Payout`) VALUES ('"+req.params.spielID+"','"+req.params.userID+"','"+req.params.hgoal+"','"+req.params.ggoal+"','"+req.params.value+"','3',true)";
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
                                     } else {
                                        const sql = "Update `wetten`(`homegoal`, `guestGoal`, `value`,`open`) VALUES ('"+req.params.hgoal+"','"+req.params.ggoal+"','"+req.params.value+"','"+req.params.odd+"',true)";
                                        connection.query(sql, function (err, results, fields) {
                                        if (err) throw err;
                                        })
                                     }
                                 })
         })

//15: BPMS Wette löschen
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

//16: BPMS Wetten einsehen
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

//17: BPMS einzelne Matchwetten
app.get('/getSingleBet/:userID/:matchID', (req, res) => {
         try{
            const sql = "Select * FROM `wetten` WHERE `wetten`.`user_id` = '"+req.params.userID+"' AND wetten.spiel_id = '"+req.params.matchID+"';";
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

function payoutBets(match_id){
    //get all bets for the match
    const sqlpay = "SELECT w.*, s.heim_points,s.gast_points From `wetten` w, spiel s WHERE w.spiel_id = `"+match_id+"` AND s.id = "+match_id+";";
    connection.query(sqlpay, function (err, results, fields) {
        if (err) throw err;
        if(results.length === 0) {
            //no bets for the Game
        } else {
            //check each bet for the result
            for(let i = 0; i<results.length;i++)
            {
                //win home team
                if(results.heim_points > results.gast_points && results.homegoal > results.guestGoal)
                {
                    pay(results.userID,(3 * results.value));
                }
                //draw
                if (results.heim_points == results.gast_points && results.homegoal === results.guestGoal)
                {
                    pay(results.userID,(3 * results.value));
                }
                //win guest team
                if(results.heim_points < results.gast_points && results.homegoal < results.guestGoal)
                {
                    pay(results.userID,(3 * results.value));
                }
                const sql = "UPDATE `wetten` SET `open`='false' WHERE id = "+results.id;
                connection.query(sql, function (err, results, fields) {

                })
            }
        }
    })
}

function pay(userID,value)
{
    const payout = "UPDATE `users` SET `bankaccount` = `bankaccount` + "+(value)+" WHERE `users`.`id` = '"+userID+"';";
    connection.query(payout, function (err, results, fields) {
        if (err) throw err;
    })
}

//18: Alle Spiele einer Mannschaft
app.get('/football/club/:id', (req, res) => {
  let clubid = req.params.id;
  const sql = "SELECT s.id, s.heimverein_id, s.gastverein_id, v1.logourl AS heimlogo, v1.name AS heimverein, s.heim_points, v2.logourl AS gastlogo, v2.name AS gastverein, s.gast_points, s.ergebnis, s.saison, s.spieltag, s.startzeitpunkt FROM spiel s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id WHERE s.heimverein_id = " + clubid + " OR s.gastverein_id = " + clubid;
  connection.query(sql, function (err, results, fields) {
    if (err) throw err;
    console.log("here are your results", results);
    if(results.length === 0) {
      res.status(204).send({ message: 'Something went wrong. is there a problem with the club id?' })
    } else {
      res.status(200).send({
         results
      })
    }
  })
})
