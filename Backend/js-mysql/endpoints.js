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

app.listen(
  PORT,
  () => console.log("its alive on http://localhost:"+PORT)
)

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
    pay(req.params.userID,req.params.value)
    const sql = "Select Kontostand From `users` WHERE `users`.`id` = '"+req.params.userID+"';";
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
app.get('/placeBet/:hgoal/:ggoals/:userID/:spielID/:value/:odd', (req, res) => {
         try{
            const sql = "INSERT INTO `wetten`(`spiel_id`, `user_id`, `homegoal`, `guestGoal`, `value`,`open`,`Payout`) VALUES ('"+req.params.spielID+"','"+req.params.userID+"','"+req.params.hgoal+"','"+req.params.ggoal+"','"+req.params.value+"','"+req.params.odd+"',false)";
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

cron.schedule("58 23 * * *", function() {
  fetch('https://api.the-odds-api.com/v4/sports/soccer_germany_bundesliga/odds/?regions=eu&markets=h2h&apiKey=aab6fa5774ec2af0b08b95eef17e9b58%27)
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

function payoutBets(match_id)
{
    //get all bets for the match
    const sql = "SELECT w.*, s.heim_points,s.gast_points From `wetten` w, spiel s WHERE w.spiel_id = `"+match_id+"` AND s.id = "+match_id+";";
    connection.query(sql, function (err, results, fields) {
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
                    pay(results.userID,(results.Payout * results.value));
                }
                //draw
                if (results.heim_points == results.gast_points && results.homegoal = results.guestGoal)
                {
                    pay(results.userID,(results.Payout * results.value));
                }
                //win guest team
                if(results.heim_points < results.gast_points && results.homegoal < results.guestGoal)
                {
                    pay(results.userID,(results.Payout * results.value));
                }
                const sql = "UPDATE `wetten` SET `open`='false' WHERE id = "+results.id+";";
                connection.query(sql, function (err, results, fields) {

                }
            }
        }
    }
    //payout winning bets
    //update each bet to closed
}

function pay(userID,value)
{
    const payout = "UPDATE `users` SET `Kontostand` = `Kontostand` + "+(value)+" WHERE `users`.`id` = '"+userID+"';";
    connection.query(payout, function (err, results, fields) {
        if (err) throw err;
    })
}